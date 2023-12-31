window.addEventListener('load', () => {

    let websocket = new WebSocket('wss://' + 'api-proxy.serveron.org' + ':443/ws');
    const delay = ms => new Promise(res => setTimeout(res, ms));
    DarkReader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10
    });

    Highcharts.chart('graph', {
        chart: {
            type: 'spline',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            animation: Highcharts.svg,
            legend: {
              color: '#D4D4D4',
              fill: '#D4D4D4'

            },
            marginRight: 10,
            events: {
                load: async function () {
                    await delay(2000);
                    websocket.readyState !==1 ? window.location.replace("https://api-proxy.serveron.org") : console.log("We have Auth for API");
                    var s = this.series;
                    websocket.onmessage = async message => {
                        var json = await JSON.parse(message.data);
                        var date = await new Date();
                        var x = await date.getTime();
                        var y = await json.requests;
                        var bl = await json.blocked;
                        var ch = await json.challenged;
                        var ps = await json.passed
                        s[0].addPoint([x, y], true, true);
                        s[1].addPoint([x, ch], true, true);
                        s[2].addPoint([x, ps], true, true);
                        s[3].addPoint([x, bl], true, true);
                    }
                }
            }
        },

        time: {
            useUTC: false
        },
        title: {
            text: 'Statistics',
            style: {
                color: '#00FF00'
            }
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Requests per second'
            },
            plotLines: [
                {
                    value: 0,
                    width: 1,
                    color: '#FFFFFF'
                }]
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y} r/s'
        },
        series: [{
            name: 'Total',
            color: '#FFFFFF',
            data: function () {
                var data = [];
                var date = new Date();
                var time = date.getTime();

                for (var i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: 0
                    });
                }
                return data;
            }()
        },
            {
                name: 'Challenged',
                color: '#ffaa00',
                data: function () {
                    var data = [];
                    var date = new Date();
                    var time = date.getTime();

                    for (var i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                }()
            },
            {
                name: 'Passed',
                color: '#00FF00',
                data: function () {
                    var data = [];
                    var date = new Date();
                    var time = date.getTime();

                    for (var i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                }()
            },
            {
                name: 'Blocked',
                color: '#FF0000',
                data: function () {
                    var data = [];
                    var date = new Date();
                    var time = date.getTime();

                    for (var i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                }()
            }]
    });

    document.querySelector('.highcharts-credits').remove();
});