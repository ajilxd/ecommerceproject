(function ($) {
    "use strict";
    function fetchDataAndUpdateChart(filter,time) {
        console.log("its in the fetch data")
        // Make AJAX request to fetch data from backend
        $.ajax({
            url: '/admin/graphdata',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    filter,
                    time
                }
            ),
            success: function(response) {
                console.log("This is response",response);
              
                // Update chart with new data
                chart.data.labels = response.labels;
                chart.data.datasets[0].data = response.salesData;
                chart.data.datasets[1].data = response.revenueData;
                chart.data.datasets[2].data = response.productsData;
    
                // Update chart
                chart.update();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching data from backend:', error);
            }
        });
    }
    
    /*Sale statistics Chart*/
    if ($('#myChart').length) {
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            
            // The data for our dataset
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                        label: 'Sales',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(44, 120, 220, 0.2)',
                        borderColor: 'rgba(44, 120, 220)',
                        data: [18, 17, 4, 3, 2, 20, 25, 31, 25, 22, 20, 9]
                    },
                    {
                        label: 'Revenue',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(4, 209, 130, 0.2)',
                        borderColor: 'rgb(4, 209, 130)',
                        data: [40, 20, 17, 9, 23, 35, 39, 30, 34, 25, 27, 17]
                    },
                    {
                        label: 'Products',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(380, 200, 230, 0.2)',
                        borderColor: 'rgb(380, 200, 230)',
                        data: [30, 10, 27, 19, 33, 15, 19, 20, 24, 15, 37, 6]
                    }

                ]
            },
            options: {
                plugins: {
                legend: {
                    labels: {
                    usePointStyle: true,
                    },
                }
                },
                scales: {
                    x: {
                        // X-axis configuration
                        type: 'category',
                        ticks: {
                            // X-axis tick configuration
                            font: {
                                size: 14
                            }
                        }
                    },
                    y: {
                        // Y-axis configuration
                        type: 'linear',
                        min: 0,
                        max: 900,
                        ticks: {
                            // Y-axis tick configuration
                            stepSize: 20,
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
        fetchDataAndUpdateChart("yearly",2024);
    } //End if

    
   
    const yearlyBtn = document.getElementById("yearlyBtn");
    const monthlyBtn = document.getElementById("monthlyBtn");
    yearlyBtn.addEventListener("click", (e)=>{
        e.stopPropagation();
        const time = document.getElementById("time").value;
         fetchDataAndUpdateChart("yearly",time);
        console.log(time)
    })
    monthlyBtn.addEventListener("click", (e)=>{
        e.stopPropagation();
        const time = document.getElementById("time").value;
         fetchDataAndUpdateChart("monthly",time);
        console.log(time)
    })
})(jQuery);