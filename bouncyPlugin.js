(function($) {

    $.fn.bouncyPlugin = function(option) {

        var DHTMLSprite = function(params) {
            var width = params.width,
                height = params.height,
                imagesWidth = params.imagesWidth;

            var $element = params.$drawTarget.append('<div/>').find(':last');
            var elemStyle = $element[0].style;
            var mathFloor = Math.floor;

            $element.css({
                position: 'absolute',
                width: width,
                height: height,
                backgroundImage: 'url(' + params.images + ')'
            });

            var that = {
                draw: function(x, y) {
                    elemStyle.left = x + 'px';
                    elemStyle.top = y + 'px';
                },
                changeImage: function(index) {
                    index *= width;
                    var vOffset = -mathFloor(index / imagesWidth) * height;
                    var hOffset = -index % imagesWidth;
                    elemStyle.backgroundPosition = hOffset + 'px ' + vOffset + 'px';
                },
                show: function() {
                    elemStyle.display = 'block';
                },
                hide: function() {
                    elemStyle.display = 'none';
                },
                destroy: function() {
                    $element.remove();
                }
            };

            return that;
        };

        var bouncySprite = function(params) {
            var x = params.x,
                y = params.y,
                xDir = params.xDir,
                yDir = params.yDir,
                maxX = params.maxX,
                maxY = params.maxY,
                animIndex = 0,
                that = DHTMLSprite(params);

            that.moveAndDraw = function(tCoeff) {
                x += xDir;
                y += yDir;

                animIndex += xDir > 0 ? 1 : -1;
                var animIndex2 = (animIndex % 5) >> 0;
                animIndex2 += animIndex2 < 0 ? 5 : 0;

                if ((xDir < 0 && x < 0) || (xDir > 0 && x >= maxX)) {
                    xDir = -xDir;
                }
                if ((yDir < 0 && y < 0) || (yDir > 0 && y >= maxY)) {
                    yDir = -yDir;
                }

                that.changeImage(animIndex2);
                that.draw(x, y);
            }



            return that;
        };

        var bouncyBoss = function(numBouncy, $drawTarget) {
            var bouncys = [],
            	timer = timeInfo(60);
            for (var i = 0; i < numBouncy; i++) {
                bouncys.push(bouncySprite({
                    images: 'withoutFPS/sprite.png',
                    imagesWidth: 256,
                    width: 64,
                    height: 64,
                    $drawTarget: $drawTarget,
                    x: Math.random() * ($drawTarget.width() - 64),
                    y: Math.random() * ($drawTarget.height() - 64),
                    xDir: Math.random() * 4 - 2,
                    yDir: Math.random() * 4 - 2,
                    maxX: $drawTarget.width() - 64,
                    maxY: $drawTarget.height() - 64
                }));

                var moveAll = function() {
                	var timeData = timer.getInfo();
                        var len = bouncys.length;
                        for (var i = 0; i < len; i++) {
                            bouncys[i].moveAndDraw(timeData.coeff);
                        }
                        setTimeout(moveAll, 100);
                    }
                    // Вызов функции moveAll() для начала работы.
                moveAll();
            }
        };

        option = $.extend({}, $.fn.bouncyPlugin.defaults, option);

        return this.each(function(){
        	var $drawTarget = $(this);
        	$drawTarget.css('background-color', option.bgColor);
        	bouncyBoss(option.numBouncy, $drawTarget);
        })
    };

    $.fn.bouncyPlugin.defaults = {
	 	bgColor: '#f00',
	 	numBouncy: 10
	 };
})(jQuery);
