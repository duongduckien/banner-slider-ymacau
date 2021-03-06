var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone, Input, Output, EventEmitter, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
var BannerSliderComponent = /** @class */ (function () {
    function BannerSliderComponent(zone, domSanitizer) {
        this.zone = zone;
        this.domSanitizer = domSanitizer;
        this.afterChange = new EventEmitter();
        this.initialized = false;
        this.packageName = 'Banner Slider YMacau';
        this.isAutoPlay = true;
        this.statusPlayVideoOnNetwork = false;
    }
    BannerSliderComponent.prototype.ngOnInit = function () {
    };
    BannerSliderComponent.prototype.ngOnChanges = function () {
        if (this.networkType === '3g' || this.networkType === '4g' || this.networkType === '5g') {
            this.isAutoPlay = false;
        }
        if (this.currentEl && !this.isAutoPlay && this.onClickEvent) {
            if (this.statusPlayVideoOnNetwork) {
                this.handleActionVideo(this.currentEl, 'pause');
                this.statusPlayVideoOnNetwork = false;
            }
            else {
                this.handleActionVideo(this.currentEl, 'play');
                this.statusPlayVideoOnNetwork = true;
            }
        }
    };
    BannerSliderComponent.prototype.ngAfterViewInit = function () {
        this.ngAfterViewChecked();
    };
    BannerSliderComponent.prototype.ngAfterViewChecked = function () {
        if (this.slider.length > 0) {
            if (!this.initialized) {
                this.initSlider();
            }
        }
    };
    BannerSliderComponent.prototype.initSlider = function () {
        var _this = this;
        this.zone.runOutsideAngular(function () {
            _this.slideWrapper = jQuery('.main-slider');
            _this.lazyImages = _this.slideWrapper.find('.slide-image');
            _this.slideWrapper.on('init', function (el) {
                _this.zone.run(function () {
                    _this.initialized = true;
                    _this.afterChange.emit({
                        currentIndex: 1,
                        length: _this.slider.length,
                    });
                    el = jQuery(el.currentTarget);
                    if (_this.isAutoPlay) {
                        _this.handleActionVideo(el, 'play');
                    }
                });
            });
            _this.slideWrapper.on('beforeChange', function (el) {
                _this.zone.run(function () {
                    // Pause video when swipe slider when type of the network isn't wifi
                    if (_this.currentEl && !_this.isAutoPlay) {
                        _this.handleActionVideo(_this.currentEl, 'pause');
                    }
                    el = jQuery(el.currentTarget);
                    if (_this.isAutoPlay) {
                        _this.handleActionVideo(el, 'pause');
                    }
                });
            });
            _this.slideWrapper.on('afterChange', function (el) {
                _this.zone.run(function () {
                    el = jQuery(el.currentTarget);
                    _this.currentEl = el;
                    var currentIndex = el.find('.slick-current').attr('data-slick-index');
                    _this.afterChange.emit({
                        currentIndex: parseInt(currentIndex, 10) + 1,
                        length: _this.slider.length,
                    });
                    _this.statusPlayVideoOnNetwork = false;
                    if (_this.isAutoPlay) {
                        _this.handleActionVideo(el, 'play');
                    }
                });
            });
            _this.slideWrapper.on('lazyLoaded', function (el) {
                _this.zone.run(function () {
                    _this.lazyImages.addClass('show');
                });
            });
            _this.slideWrapper.on('destroy', function (event, slick) {
                _this.zone.run(function () {
                    _this.initialized = false;
                });
            });
            _this.slideWrapper.slick({
                autoplaySpeed: 4000,
                lazyLoad: 'ondemand',
                speed: 600,
                arrows: false,
                dots: false,
                mobileFirst: true,
                waitForAnimate: false,
                adaptiveHeight: true,
                touchThreshold: 20
            });
        });
    };
    /**
     * @param  {any} player
     * @param  {any} command
     */
    BannerSliderComponent.prototype.postMessageToPlayer = function (player, command) {
        if (player == null || command == null) {
            return;
        }
        player.contentWindow.postMessage(JSON.stringify(command), '*');
    };
    /**
     * @param  {any} element
     * @param  {any} control
     */
    BannerSliderComponent.prototype.handleActionVideo = function (element, control) {
        var currentSlide = element.find('.slick-current');
        var slideType = currentSlide.children().children().attr('class').split(' ')[1];
        var player = currentSlide.find('iframe').get(0);
        if (slideType === 'vimeo') {
            switch (control) {
                case 'play': {
                    this.postMessageToPlayer(player, {
                        'method': 'play',
                        'value': 1,
                    });
                    break;
                }
                case 'pause': {
                    this.postMessageToPlayer(player, {
                        'method': 'pause',
                        'value': 1,
                    });
                    break;
                }
            }
        }
        else if (slideType === 'youtube') {
            switch (control) {
                case 'play': {
                    this.postMessageToPlayer(player, {
                        'event': 'command',
                        'func': 'playVideo',
                    });
                    break;
                }
                case 'pause': {
                    this.postMessageToPlayer(player, {
                        'event': 'command',
                        'func': 'pauseVideo',
                    });
                    break;
                }
            }
        }
        else if (slideType === 'video') {
            var video = currentSlide.children().children().children().children('video').get(0);
            if (video != null) {
                if (control === 'play') {
                    video.play();
                }
                else {
                    video.pause();
                }
            }
        }
    };
    /**
     * @param  {string} url
     * @param  {string} type
     */
    BannerSliderComponent.prototype.createSource = function (url, type) {
        var vimeoConfig = this.config['vimeo']['params'];
        var youtubeConfig = this.config['youtube']['params'];
        if (vimeoConfig && youtubeConfig) {
            switch (type) {
                case 'youtube': {
                    return url + "?" + this.queryParams(youtubeConfig);
                }
                case 'vimeo': {
                    return url + "?" + this.queryParams(vimeoConfig);
                }
            }
        }
    };
    /**
     * @param  {any} params
     */
    BannerSliderComponent.prototype.queryParams = function (params) {
        return Object.keys(params).map(function (key) { return key + "=" + params[key]; }).join('&');
    };
    BannerSliderComponent.prototype.ngOnDestroy = function () {
        this.slideWrapper = undefined;
    };
    /**
     * @param  {string} label
     * @param  {any} data
     */
    BannerSliderComponent.prototype.debug = function (label, data) {
        console.log(this.packageName + ": ", label, data);
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BannerSliderComponent.prototype, "config", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BannerSliderComponent.prototype, "slider", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BannerSliderComponent.prototype, "networkType", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BannerSliderComponent.prototype, "onClickEvent", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], BannerSliderComponent.prototype, "afterChange", void 0);
    BannerSliderComponent = __decorate([
        Component({
            selector: 'banner-slider-ymacau',
            template: "<div>\n    <div class=\"main-slider\" *ngIf=\"slider.length > 0\">\n        <div class=\"item-list\" *ngFor=\"let item of slider; let i = index\">\n            <div [ngSwitch]=\"item.type\">\n                <ng-template [ngSwitchCase]=\"'image'\">\n                    <div class=\"item image\">\n                        <div class=\"item-wrapper\">\n                            <div class=\"slide-image slide-media\" [ngStyle]=\"{ 'background-image': 'url(' + item.src + ')' }\">\n                                <img [attr.data-lazy]=\"item.src\" class=\"image-entity\" />\n                            </div>\n                        </div>\n                    </div>\n                </ng-template>\n\n                <ng-template [ngSwitchCase]=\"'video'\">\n                    <div *ngIf=\"item.videoType === 'vimeo'\" class=\"item vimeo\">\n                        <div class=\"item-wrapper\">\n                            <iframe \n                                class=\"embed-player slide-media\"\n                                [src]=\"createSource(item.src, 'vimeo') | safe\"\n                                frameborder=\"0\" \n                                webkitallowfullscreen \n                                mozallowfullscreen\n                                allowfullscreen\n                                [width]=\"config?.vimeo?.width\" \n                                [height]=\"config?.vimeo?.height\" \n                            ></iframe>\n                        </div>\n                    </div>\n\n                    <div *ngIf=\"item.videoType === 'youtube'\" class=\"item youtube\">\n                        <div class=\"item-wrapper\">\n                            <iframe \n                                class=\"embed-player slide-media\"\n                                [src]=\"createSource(item.src, 'youtube') | safe\"\n                                frameborder=\"0\" \n                                webkitallowfullscreen \n                                mozallowfullscreen\n                                allowfullscreen\n                                [width]=\"config?.youtube?.width\" \n                                [height]=\"config?.youtube?.height\" \n                            ></iframe>\n                        </div>\n                    </div>\n\n                    <div *ngIf=\"item.videoType === 'local'\" class=\"item video\">\n                        <div class=\"item-wrapper\">\n                            <video \n                                class=\"slide-video slide-media\" \n                                playsinline \n                                loop \n                                muted \n                                preload=\"metadata\"\n                                [attr.poster]=\"(item.image === undefined || item.image === null ||item.image === '') ? 'banner-slider-ymacau/no-image.png' : item.image\"\n                            >\n                                <source [src]=\"item?.src\" type=\"video/mp4\" />\n                            </video>\n                        </div>\n                    </div>\n                </ng-template>\n            </div>\n        </div>\n    </div>\n</div>",
            styles: [".slick-slide {\n  position: relative;\n  height: 56.25vw;\n}\n\n.slick-slide iframe {\n  position: relative;\n  pointer-events: none;\n}\n\n.slick-slide .slide-image {\n  opacity: 0;\n  height: 100%;\n  background-size: cover;\n  background-position: center;\n  transition: all .8s ease;\n}\n\n.slick-slide .slide-image.show {\n  opacity: 1;\n}\n\n.slick-slide .image-entity {\n  width: 100%;\n  opacity: 0;\n  visibility: hidden;\n}\n\n.slick-dots {\n  display: none !important;\n}\n\n.item-wrapper {\n  width: 100vw;\n  height: 0;\n  padding-bottom: 56.25%;\n  padding-top: 30px;\n  position: relative;\n  overflow: hidden;\n}\n\n.item-wrapper .slide-media {\n  width: 100vw;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  // object-fit: cover;\n}\n"]
        }),
        __metadata("design:paramtypes", [NgZone,
            DomSanitizer])
    ], BannerSliderComponent);
    return BannerSliderComponent;
}());
export { BannerSliderComponent };
//# sourceMappingURL=banner-slider.js.map