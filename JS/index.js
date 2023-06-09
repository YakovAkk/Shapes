
var shapeController = {
    width: 0,
    height: 0,
    points: [],
    blueCircle: {},
    yellowCircle: {},
    mouseDownOnPoint: -1,
    mousePointOffset: 0,
    
    init: function(){
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.width = this.canvas.width  = window.innerWidth - 20;
        this.height = this.canvas.height = window.innerHeight - 50;			
        this.ctx.font = 'bold 40px Comic Sans';
        this.canvas.addEventListener('mousedown', this.mousedownEventListener, false);
        this.canvas.addEventListener('mousemove', this.mousemoveEventListener, false);
        this.canvas.addEventListener('mouseup', this.mouseupEventListener, false);

        this.points = [];
        this.blueCircle = {};
        this.yellowCircle = {};
    },

    mousedownEventListener: function(event){
        var x = event.pageX,
        y = event.pageY;
        
        shapeController.points.forEach(function(point, i) {
            if (Math.sqrt((x-point.posx)*(x-point.posx) + (y-point.posy)*(y-point.posy)) < point.radius * 2) {
                shapeController.mouseDownOnPoint = i;
            }
        });

        if(shapeController.mouseDownOnPoint != -1){
            mousePointOffset = {
                x: shapeController.points[shapeController.mouseDownOnPoint].posx - x,
                y: shapeController.points[shapeController.mouseDownOnPoint].posy - y,
            };
            shapeController.movePoint(event);
        }
        else if(shapeController.points.length < 4){
            shapeController.addNewPoint(event);

            if(shapeController.points.length == 4)
                shapeController.addFiguresInfo();

            shapeController.render();
        }
    },

    mousemoveEventListener: function(event){
        shapeController.movePoint(event);
    },

    mouseupEventListener: function(event){
        shapeController.movePoint(event);
        shapeController.mouseDownOnPoint = -1;
    },

    addNewPoint: function(event) {
        this.points.push({
            posx: event.pageX,
            posy: event.pageY,
            radius: 5,
            color: 'red'
        });
    },

    movePoint: function(event){
        if(shapeController.mouseDownOnPoint != -1){
            shapeController.points[shapeController.mouseDownOnPoint].posx = event.pageX + mousePointOffset.x;
            shapeController.points[shapeController.mouseDownOnPoint].posy = event.pageY + mousePointOffset.y;

            if(shapeController.points.length == 4)
                shapeController.addFiguresInfo();

            shapeController.render();
        }
    },

    addFiguresInfo: function() {
        this.blueCircle = this.fillCircleData(shapeController.points[0],shapeController.points[1],
            "blue")
            this.yellowCircle = this.fillCircleData(shapeController.points[2],
                shapeController.points[3],
                "yellow")
        
    },

    fillCircleData: function(point1, point2, color){
        let r = Math.sqrt(Math.pow((point2.posx - point1.posx),2) + 
        Math.pow((point2.posy - point1.posy),2));
        return {
            color: color,
            s: 2 * Math.PI * r,
            radius: r,
            point: {
                posx: point1.posx,
                posy: point1.posy,
            }			
        }
    },

    render: function() {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        //console.log(shapeController.points);
        shapeController.points.forEach(function(point) {
            shapeController.ctx.strokeStyle = point.color;
            shapeController.ctx.beginPath();
            shapeController.ctx.arc(point.posx, point.posy, point.radius, 0, 2*Math.PI);
            shapeController.ctx.stroke();

            var str = '(' + point.posx + ', ' + point.posy + ')';
            shapeController.ctx.fillStyle = "white";
            shapeController.ctx.fillText(str, point.posx - str.length / 2 * 18, point.posy - 20);
        });

        if(shapeController.blueCircle.point != null ){
            this.drawCircle(shapeController.blueCircle)
        }

        if(shapeController.yellowCircle.point != null){
            this.drawCircle(shapeController.yellowCircle)
        }
    },
    
    drawCircle : function(circle){
        shapeController.ctx.strokeStyle = circle.color;
        shapeController.ctx.beginPath();
        shapeController.ctx.arc(circle.point.posx, circle.point.posy, circle.radius, 0, 2*Math.PI);
        shapeController.ctx.stroke();
    },

    start: function(){
        this.init();
        this.render();
    }
};

window.addEventListener("load",	function(){ shapeController.start(); });

function reset() {
    shapeController.start();
}

function about() {			
    alert(
        "Натисни будь-де по чорному канвасу щоб поставити точку. \n"+
        "Максимум можна поставити 4 точки. \n"+
        "Як тільки всі 4 точки буде виставлено за ними побудується два кола. \n"+
        "Синє коло з центром у точці A, радіус якого дорівнює відстані від точки A до точки B.\n"+
        "Та жовте коло з центром у точці С, радіус якого дорівнює відстані від точки C до точки D.\n"+
        "Точки можна рухати звичайним натиском та перетягуванням \n"+
        "(C) Yakiv Yasko"
        );
}

