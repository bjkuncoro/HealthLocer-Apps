$(window).load(function() {
    // Animate loader off screen
            setTimeout(function(){
                $(".se-pre-con").fadeToggle('medium');                
            },2000);
});
$("#header").load("header.html");
$("#footer").load("footer.html");
function cpu_chart() {
  var ctx = document.getElementById("cpu_chart").getContext("2d");
  var ctxtraffic = document.getElementById("traffic_chart").getContext("2d");
  var data = {
    labels: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    datasets: [{
      label: "Real Time Cpu Usage(%)",
      lineTension:0,
      borderWidth:1,
      backgroundColor:"rgba(254, 255, 0, 0.4392156862745098)",
    //   fillColor: "rgba(220,220,220,0.2)",
    //   strokeColor: "rgba(220,220,220,1)",
    //   pointColor: "rgba(220,220,220,1)",
    //   pointStrokeColor: "#b8ed47",
    //   pointHighlightFill: "#b8ed47",
    //   pointHighlightStroke: "rgba(220,220,220,1)",
      data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }]
  };
  var datatraffic = {
    labels: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    datasets: [{
      label: "Transfer rate(kb)",
      lineTension:0.1,
      borderWidth:1,
      backgroundColor:"rgba(218, 253, 11, 0.26)",
    //   fillColor: "rgba(220,220,220,0.2)",
    //   strokeColor: "rgba(220,220,220,1)",
    //   pointColor: "rgba(220,220,220,1)",
    //   pointStrokeColor: "#b8ed47",
    //   pointHighlightFill: "#b8ed47",
    //   pointHighlightStroke: "rgba(220,220,220,1)",
      data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    },{
      label: "Received rate(kb)",
      lineTension:0.1,
      borderWidth:1,
      backgroundColor:"rgba(93, 156, 236, 0.6392156862745098)",
    //   fillColor: "rgba(220,220,220,0.2)",
    //   strokeColor: "rgba(220,220,220,1)",
    //   pointColor: "rgba(220,220,220,1)",
    //   pointStrokeColor: "#b8ed47",
    //   pointHighlightFill: "#b8ed47",
    //   pointHighlightStroke: "rgba(220,220,220,1)",
      data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }]
  };
  var options = {
    animation: false,
    bezierCurve : false,
    //Boolean - If we want to override with a hard coded scale
    scaleOverride: true,
    //** Required if scaleOverride is true **
    //Number - The number of steps in a hard coded scale
    scaleSteps: 10,
    //Number - The value jump in the hard coded scale
    scaleStepWidth: 10,
    //Number - The scale starting value
    scaleStartValue: 0,
    scales:
        {
            xAxes: [{
                display: false
            }]
        },
    
  };

var myLineChart = new Chart(ctx , {
    type: "line",
    data: data,
    options:options
});
var mytrafficChart = new Chart(ctxtraffic , {
    type: "line",
    data: datatraffic,
    options:options
});
  var cpu;
  function setData(data) {
    data.push(cpu);
    data.shift();
  }
var socket = io('http://203.24.50.81:1111'); 
socket.on('data_cpu',function(hasil){
    cpu=hasil.cpu;
    // console.log(hasil);
    setData(data.datasets[0].data);
    myLineChart.update();
});
socket.on('data_bandwidth',function(traffic){
    // console.log(traffic);
    var arr_tx  =   datatraffic.datasets[0].data;
    var arr_rx  =   datatraffic.datasets[1].data;
    arr_tx.push((traffic.tx).toFixed(1));
    arr_tx.shift();
    arr_rx.push((traffic.rx).toFixed(1));
    arr_rx.shift();
    // setData(data.datasets[0].data);
    mytrafficChart.update();
});
};

function memori_chart(){
    var configMemoryUsagePie = {
        type: 'doughnut',
        data: {
            labels: [
                "Used Memory",
                "Free Memory"
            ],
            datasets: [{
                data: [100, 100],
                backgroundColor: [
                "#96baf7",
                "#504f59"
                ],
                hoverBackgroundColor: [
                "#96baf7",
                "#504f59"
                ]
            }]
        },
        options: {
            pieceLabel: {
                render: 'percentage',
                fontColor: ['white', 'white'],
                precision: 2
              }
        }
    };
    
    var memoryUsageChartPie = new Chart(document.getElementById("mem_chart").getContext("2d"), configMemoryUsagePie);
    var socket = io('http://203.24.50.81:1111'); 

    socket.on('data_mem',function(hasil){
        // console.log(hasil);
        var mem = hasil.mem;
        configMemoryUsagePie.data.datasets[0].data[0] = mem;
        configMemoryUsagePie.data.datasets[0].data[1] = 100-mem;
        memoryUsageChartPie.update();
    });
}

function os_info(){
    var socket = io('http://203.24.50.81:1111');   
    socket.on('os_info',function(data){
        // console.log(data.os_totalmem/1000000);
        $('.host').text(data.host['venet0:0'][0].address);
        $('.os').text(data.os_info.distro);
        $('.os_v').text(''+data.os_info.release+' ');
        $('.os_arch').text(data.os_info.arch); 
        $('.processor').text(data.os_arch[0].model);  
        $('.uptime').text((data.uptime).toFixed(2)+' Jam');
        $('.totalmem').text((data.os_totalmem/1000000).toFixed(0)+' MB')     
        
    });
}

function req_jam(){
    $.getJSON( "http://203.24.50.81:2020/laporan", function( data ) {
        // console.log(data.visit_time.data);
        var datatbl = data.visit_time.data;
        $('.totreq').text(data.general.total_requests);
        // console.log(datatbl);     
        var areqperjam = 0;
        for(var i in datatbl){
            areqperjam += datatbl[i].hits.count;  
        }
        var reqperjam = areqperjam/datatbl.length;
        $('.req-jam').text((reqperjam).toFixed(1)+'/Hr');  
        // var i=datatbl.length-1;i>datatbl.length-4;i-- 
        for(var i in datatbl){
            var tr="<tr>";
            var td1="<td>"+datatbl[i].data+"</td>";
            var td2="<td>"+datatbl[i].bytes.count/1000+"Kb</td>";
            var td3="<td>"+datatbl[i].hits.count+"</td></tr>";
    
           $("#reqtbl").append(tr+td1+td2+td3); 
    
        }   
                  
        })
};

function status_code(){
    $.getJSON( "http://203.24.50.81:2020/laporan", function( data ) {
        // console.log(data.not_found.data);
        var requrl          =   data.requests.data;
        var statusdatatbl   =   data.status_codes.data;
        var not_foundurl    =   data.not_found.data;   
        // console.log(statusdatatbl);   
        for(var i in statusdatatbl){
            var tr="<tr>";
            var td1="<td>"+statusdatatbl[i].data+"</td>";
            var td2="<td>"+statusdatatbl[i].hits.percent+"%</td>";
            var td3="<td>"+statusdatatbl[i].hits.count+"</td></tr>";
    
           $("#statuscodetbl").append(tr+td1+td2+td3); 
         }   
        for(var i in requrl){
            var tr="<tr>";
            var td1="<td>"+requrl[i].hits.count+"</td>";
            var td2="<td>"+requrl[i].method+"</td>";
            var td3="<td>"+requrl[i].data+"</td></tr>";
    
           $("#requrltbl").append(tr+td1+td2+td3); 
        }
        for(var i in not_foundurl){
            var tr="<tr class='scrtbl'>";
            var td1="<td class='scrtbl tdfloat col-xs-3'>"+not_foundurl[i].hits.count+"</td>";
            var td2="<td class='scrtbl tdfloat col-xs-3'>"+not_foundurl[i].method+"</td>";
            var td3="<td class='scrtbl tdfloat col-xs-6'>"+not_foundurl[i].data+"</td></tr>";
    
           $("#notfoundtbl").append(tr+td1+td2+td3); 
        }
        })
};

function visitor(){
    $.getJSON('http://203.24.50.81:2020/laporan',function(data){
        console.log(data.hosts.data);
        for(var i in data.hosts.data){
            var tr="<tr>";
            var td1="<td>"+data.hosts.data[i].hits.count+"</td>";
            var td2="<td>"+(data.hosts.data[i].bytes.count/1000000).toFixed(1)+"MB</td>";
            var td3="<td>"+data.hosts.data[i].data+"</td>";
            var td4="<td style='font-size:12px'>"+data.hosts.data[i].country+"</td></tr>";            
    
           $("#visitor").append(tr+td1+td2+td3+td4); 
        }
    });
}

memori_chart();
cpu_chart();
os_info();
setInterval(function(){
    $("#reqtbl").empty();     
    req_jam();
},5000)
status_code();
visitor();


 //pickerdatetime
 $('.date').pickadate({
        monthsFull: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        showMonthsShort: true,
        format: 'yyyy-mmmm-dd',
    });
    $("#dtBox").DateTimePicker({
        minuteInterval:60,
    });

    //pickerdatetime
    //sorting data per waktu
    $('#cek_data').on('click', function(){ 
        // $('#cek-log').modal('hide');        
        // $('#cek-log2').modal('show');
        var tanggal =   $('#input_tanggal').val();
        var waktu   =   $('#input_waktu').val();
        var arrwaktu   =   waktu.split(':')
        console.log(tanggal);
        console.log(arrwaktu[0]);
        var today   =   new Date().format("yyyy-mm-dd");
        console.log(today);
        if(tanggal==today){
            console.log('today');
            $.getJSON('http://203.24.50.81:2020/laporan',function(data){
            // console.log(data.visit_time);
                var newArr = data.visit_time.data.filter(function(el){
                return el.data ===  arrwaktu[0];
                });
            console.log(newArr);
            var tfreq       =   newArr[0].hits.count;
            var tfreqbw     =   newArr[0].bytes.count/1000;
            $('.tfreq').text(tfreq);
            $('.tfreqbw').text(tfreqbw+'kb');
            for(var i in data.hosts.data){
                var tr="<tr>";
                var td1="<td>"+data.hosts.data[i].hits.count+"</td>";
                var td2="<td>"+(data.hosts.data[i].bytes.count/1000000).toFixed(1)+"MB</td>";
                var td3="<td>"+data.hosts.data[i].data+"</td>";
                var td4="<td style='font-size:12px'>"+data.hosts.data[i].country+"</td></tr>";            
        
               $("#log-visitor").append(tr+td1+td2+td3+td4); 
            }
            for(var i in data.status_codes.data){
                var tr="<tr>";
                var td1="<td>"+data.status_codes.data[i].data+"</td>";
                var td2="<td>"+data.status_codes.data[i].hits.percent+"%</td>";
                var td3="<td>"+data.status_codes.data[i].hits.count+"</td></tr>";
        
               $("#log-statuscodetbl").append(tr+td1+td2+td3); 
             }            
            })
        }else{
            console.log('not today');
            $.getJSON('http://203.24.50.81:2020/backuplogs/'+tanggal+'',function(data){
            console.log(data.visit_time);
            var newArr = data.visit_time.data.filter(function(el){
                return el.data ===  arrwaktu[0];
                });
            console.log(newArr);
            var tfreq       =   newArr[0].hits.count;
            var tfreqbw     =   newArr[0].bytes.count/1000;
            $('.tfreq').text(tfreq);
            $('.tfreqbw').text(tfreqbw+'kb');
            for(var i in data.hosts.data){
                var tr="<tr>";
                var td1="<td>"+data.hosts.data[i].hits.count+"</td>";
                var td2="<td>"+(data.hosts.data[i].bytes.count/1000000).toFixed(1)+"MB</td>";
                var td3="<td>"+data.hosts.data[i].data+"</td>";
                var td4="<td style='font-size:12px'>"+data.hosts.data[i].country+"</td></tr>";            
        
               $("#log-visitor").append(tr+td1+td2+td3+td4); 
            }
            for(var i in data.status_codes.data){
                var tr="<tr>";
                var td1="<td>"+data.status_codes.data[i].data+"</td>";
                var td2="<td>"+data.status_codes.data[i].hits.percent+"%</td>";
                var td3="<td>"+data.status_codes.data[i].hits.count+"</td></tr>";
        
               $("#log-statuscodetbl").append(tr+td1+td2+td3); 
             }
            })
        }
        $('.h5dt').html('<span>'+tanggal+'   '+arrwaktu[0]+'.00</span>');
        $.getJSON( 'http://203.24.50.81:2020/logs/'+tanggal+'/'+arrwaktu[0]+'', function( data ) {
            // console.log(data);   
			var arrmenit_cpu = [];
            var arrfixmenit= [];
            // grep CRON /var/log/syslog
			for(var i in data.logs) {
                //ambil string menit
                var waktu       = data.logs[i].time;
                var splitwaktu  = waktu.split(' ');
                var jam         = splitwaktu[1];
                var splitjam    = jam.split(':');
                var menit       = splitjam[1];
                arrmenit_cpu.push({menit:Number(menit),cpu:data.logs[i].cpu});
            };
            // console.log(arrmenit_cpu);            
            result = arrmenit_cpu.reduce(function (r, a) {
                r[a.menit] = r[a.menit] || [];
                r[a.menit].push(a.cpu);
                return r;
            }, Object.create(null));
            // console.log(result);
            var rerata = [];
            for(var i in result){
                result[i] = result[i].filter(function( element ) {
                return element !== undefined;
                });
                var total = 0;
                for (var z in result[i]){
                    total += result[i][z];
                }
                var avg = total /result[i].length;
                rerata.push(avg.toFixed(1));
            }
            // console.log(rerata);
            for(var i in arrmenit_cpu){
                var value = arrmenit_cpu[i].menit;
                if(arrfixmenit.indexOf(value) !== -1){//jika tidak di temukan maka return -1
                }else{arrfixmenit.push(arrmenit_cpu[i].menit)}
            }
            // console.log(arrfixmenit);        
            var ctx = document.getElementById("cek").getContext("2d");
			window.myBar = new Chart(ctx, {
				type: 'bar',
				data: {
			    labels: arrfixmenit,
			    datasets: [{
			      label: 'cpu',
			      data: rerata,
			      backgroundColor: "rgba(153,255,51,0.6)"
			    }]
			  },
				options: {
					// Elements options apply to all of the options unless overridden in a dataset
					// In this case, we are setting the border of each bar to be 2px wide and green
					elements: {
						rectangle: {
							borderWidth: 2,
							borderColor: 'rgb(0, 255, 0)',
							borderSkipped: 'bottom'
						}
					},
					responsive: true,
					legend: {
						position: 'top',
					},
					title: {
						display: true,
						text: 'Log Cpu Usage PerMenit'
					},
					pan: {
						enabled: true,
						mode: 'x' // is panning about the y axis neccessary for bar charts?
					},
					zoom: {
						enabled: true,
						mode: 'x',
						sensitivity: 3,
						limits: {
							max: 10,
							min: 0.5
						}
					},
					scales: {
						xAxes: [{
							ticks: {
								min: 0,
								max: 15
							}
						}],
                        // yAxes: [{
                        //     display: true,
                        //     ticks: {
                        //         beginAtZero: true,
                        //         steps: 10,
                        //         stepValue: 5,
                        //         max: 100
                        //     }
                        // }]
					}
				}
			});
    });
});
    //sorting data per waktu