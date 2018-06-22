
module.exports = function(grunt) {

    const _ = require('lodash');
    const elasticsearch = require('elasticsearch');
    const es = new elasticsearch.Client({
        host: 'localhost:9200'
    });
    const http = require('http');
    const agent = new http.Agent();
    const HCCrawler = require('headless-chrome-crawler');
    var axeSource = grunt.file.read(require.resolve('axe-core'));
    const httpDefaults = {
        hostname: 'localhost',
        port: 9200,
        method: 'PUT'
    };

    grunt.registerTask('crawl', 'Crawl configured URLS for a11y testing',
        function(){
            done = this.async();
            (async () => {

                const crawler = await HCCrawler.launch({
                    // maximum number of requests at once
                    maxConcurrency: 1,
                    retryCount: 1,
                    customCrawl: async (page, crawl) => {

                        const result = await crawl();

                        /**
                         * Add axe to the dom of the pulled page by reading the whole script into the page.
                         * (Yeah, less than ideal.)
                         */
                        await page.evaluate(axeSource);

                        //add axe results to the crawl result
                        result.a11y = await page.evaluate(async function(){
                            return await axe.run(document);
                        });

                        return result;
                    },
                    // Function to be called with evaluated results from browsers
                    onSuccess: async page => {
                        let data = JSON.stringify(page || {}, null, '     ');
                        let esResult = false;
                        const id = page.response.url.replace(/[^a-z0-9]+/ig, '-').replace(/[\-]+/ig, '-');
                        try {
                            esResult = await es.create({
                                index: 'bcm.edu'
                                , type: 'a11y'
                                , body: data
                                , id: id
                            });
                        } catch (e){
                            console.log(e);
                        }

                    },
                    onError: (error => {
                        console.log(error);
                    })
                });
                // Queue a request
                await crawler.queue({
                    url: 'https://oneweb-staging.bcm.edu/',
                    // Emulate a tablet device
                    device: 'Nexus 7',
                    // automatically scan up to 20 links deep
                    // WARNING: n^20 can be BIG
                    maxDepth: 1,



                    // delay between requests
                    delay: 50,
                    timeout: 0,
                    // allowedHosts
                    // Enable screenshot by passing options
                    allowedDomains: ['oneweb-staging.bcm.edu']
                    /*
                    screenshot: {
                        path: './tmp/staging-home.png'
                        , fullPage: true
                    },
                    */
                });
                // Queue multiple requests
                // await crawler.queue(['https://example.net/', 'https://example.org/']);
                // Queue a request with custom options
                await crawler.onIdle(); // Resolved when no queue is left
                await crawler.close(); // Close the crawler
                done();
            })();
        }
    );
    return 'Registered.';
};