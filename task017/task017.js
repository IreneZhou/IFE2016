/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
window.onload = function() {
    function getDateStr(dat) {
        var y = dat.getFullYear();
        var m = dat.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dat.getDate();
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
    }

    function randomBuildData(seed) {
        var returnData = {};
        var dat = new Date("2016-01-01");
        var datStr = '';
        for (var i = 1; i < 92; i++) {
            datStr = getDateStr(dat);
            returnData[datStr] = Math.ceil(Math.random() * seed);
            dat.setDate(dat.getDate() + 1);
        }
        return returnData;
    }

    var aqiSourceData = {
        "北京": randomBuildData(500),
        "上海": randomBuildData(300),
        "广州": randomBuildData(200),
        "深圳": randomBuildData(100),
        "成都": randomBuildData(300),
        "西安": randomBuildData(500),
        "福州": randomBuildData(100),
        "厦门": randomBuildData(100),
        "沈阳": randomBuildData(500)
    };

    var $ = function (id) {
        return document.getElementById(id);
    };

// 用于渲染图表的数据
    var chartData = {};

// 记录当前页面的表单选项
    var pageState = {
        nowSelectCity: 0,
        nowGraTime: "day"
    };

    /**
     * 渲染图表
     */

    function color(val) {
        if (val <= 100 ) {
            return "#E16B8C";
        }
        else if (val > 100 && val <= 200) {
            return "#EB7A77"
        }
        else if (val > 200 && val <= 300) {
            return "#D9CD90";
        }
        else if (val > 300 && val <= 400) {
            return "#90B44B";
        }
        else {
            return "#5DAC81";
        }

    }

    function renderChart() {

        var chartWrap = document.getElementsByClassName("aqi-chart-wrap")[0];
        chartWrap.innerHTML = "";
        if (pageState.nowGraTime === "day") {
            for (var i in chartData.day) {
                chartWrap.innerHTML += "<div class='aqi-chart' style='width:10px;height:" + chartData.day[i] +
                    "px;background:" + color(chartData.day[i])+"'</div>";
            }

        }

        if (pageState.nowGraTime === "week") {
            for (var i in chartData.week) {
                chartWrap.innerHTML +=
                    "<div class='aqi-chart' " +
                    "style='width:30px;height:" + chartData.week[i] + "px;background:" +
                    color(chartData.week[i])+"'</div>"
            }

        }
        if (pageState.nowGraTime === "month") {
            for (var i in chartData.month) {
                chartWrap.innerHTML +=
                    "<div class='aqi-chart' " +
                    "style='width:50px;height:" + chartData.month[i] + "px;background:" +
                    color(chartData.month[i])+"'</div>"
            }

        }


    }

    /**
     * 日、周、月的radio事件点击时的处理函数
     */
    function graTimeChange() {
        // 确定是否选项发生了变化

        // 设置对应数据

        // 调用图表渲染函数
        var time = $("form-gra-time").getElementsByTagName("input");
        if (time[0].checked) {
            pageState.nowGraTime = "day";
        }
        else if (time[1].checked) {
            pageState.nowGraTime = "week";
        }
        else if (time[2].checked) {
            pageState.nowGraTime = "month";
        }
        renderChart();
    }

    /**
     * select发生变化时的处理函数
     */
    function citySelectChange() {
        // 确定是否选项发生了变化
        pageState.nowSelectCity = $("city-select").selectedIndex;
        initAqiChartData();
        renderChart();
        // 设置对应数据

        // 调用图表渲染函数
    }

    /**
     * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
     */
    function initGraTimeForm() {
        var time = $("form-gra-time").getElementsByTagName("input");
        for (var i = 0; i < time.length; i++) {
            time[i].addEventListener("click", graTimeChange);
        }
    }

    /**
     * 初始化城市Select下拉选择框中的选项
     */
    function initCitySelector() {

        // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
        var choices = $("city-select");
        var option = "";
        for (var city in aqiSourceData) {
            option += "<option>" + city + "</option>";
        }
        choices.innerHTML = option;
        choices.addEventListener("change", citySelectChange);

        // 给select设置事件，当选项发生变化时调用函数citySelectChange

    }

    /**
     * 初始化图表需要的数据格式
     */
    function initAqiChartData() {
        // 将原始的源数据处理成图表需要的数据格式
        // 处理好的数据存到 chartData 中
        // day
        var choices = $("city-select");
        var city = choices.options[pageState.nowSelectCity].value;
        chartData.day = aqiSourceData[city];

        // week
        chartData.week = {};
        var count = 0;
        var temp = 0;
        var weekday = 0;
        for (var i in aqiSourceData[city]) {
            var date = new Date(i);
            temp += aqiSourceData[city][i];
            if (date.getDay() == 6) {
                weekday += 1;
                chartData.week[count] = Math.round(temp / weekday);
                temp = 0;
                count += 1;
                weekday = 0;
            }
            else {
                weekday += 1;
            }
        }
        if (temp != 0) {
            chartData.week[count] = Math.round(temp / weekday);
        }

        // Month
        chartData.month = {};
        var month;
        var pre = undefined;
        count = 0;
        temp = 0;
        var monthday = 0;
        for (var i in aqiSourceData[city]) {
            month = (new Date(i)).getMonth();
            if (!pre) {
                pre = month;
            }
            else if (month !== pre) {
                count += 1;
                monthday += 1;
                chartData.month[count] = Math.round(temp / monthday);
                monthday = 0;
                pre = month;
                temp = aqiSourceData[city][i];
            }
            else {
                monthday += 1;
                temp += aqiSourceData[city][i];
            }
        }
        if (temp != 0) {
            chartData.month[count] = Math.round(temp / monthday);
        }


    }

    /**
     * 初始化函数
     */
    function init() {
        initGraTimeForm();
        initCitySelector();
        initAqiChartData();
        renderChart();
    }

    init();
};