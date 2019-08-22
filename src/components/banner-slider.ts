import {
    Component,
    NgZone,
    Input,
    Output,
    ElementRef,
    OnDestroy,
    OnChanges,
    AfterViewInit,
    AfterViewChecked,
    EventEmitter,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

declare const jQuery: any;

@Component({
    selector: 'banner-slider-ymacau',
    templateUrl: 'banner-slider.html',
    styleUrls: ['banner-slider.scss']
})
export class BannerSliderComponent implements OnDestroy, OnChanges, AfterViewInit, AfterViewChecked {

    @Input() config: any;
    @Input() slider: any;
    @Input() networkType: any;

    @Output() afterChange: EventEmitter<any> = new EventEmitter();

    private slideWrapper: any;
    private lazyImages: any;
    private initialized: boolean = false;
    private packageName: string = 'Banner Slider YMacau';
    private isAutoPlay: boolean = true;

    constructor(
        public zone: NgZone,
        public domSanitizer: DomSanitizer,
    ) {

    }

    ngOnInit() {

    }

    ngOnChanges() {
        if (this.networkType === '3g' || this.networkType === '4g' || this.networkType === '5g') {
            this.isAutoPlay = false;
        }
    }

    ngAfterViewInit(): void {
        this.ngAfterViewChecked();
    }

    ngAfterViewChecked() {
        if (this.slider.length > 0) {
            if (!this.initialized) {
                this.initSlider();
            }
        }
    }

    initSlider() {

        this.zone.runOutsideAngular(() => {

            this.slideWrapper = jQuery('.main-slider');
            this.lazyImages = this.slideWrapper.find('.slide-image');

            this.slideWrapper.on('init', (el: any) => {
                this.zone.run(() => {
                    this.initialized = true;
                    el = jQuery(el.currentTarget);
                    this.handleActionVideo(el, 'play');
                });
            });

            this.slideWrapper.on('beforeChange', (el: any) => {
                this.zone.run(() => {
                    el = jQuery(el.currentTarget);
                    this.handleActionVideo(el, 'pause');
                });
            });

            this.slideWrapper.on('afterChange', (el: any) => {
                this.zone.run(() => {
                    el = jQuery(el.currentTarget);
                    const currentIndex = el.find('.slick-current').attr('data-slick-index');
                    this.afterChange.emit({
                        currentIndex: parseInt(currentIndex, 10) + 1,
                        length: this.slider.length,
                    });
                    this.handleActionVideo(el, 'play');
                });
            });

            this.slideWrapper.on('lazyLoaded', (el: any) => {
                this.zone.run(() => {
                    this.lazyImages.addClass('show');
                });
            });

            this.slideWrapper.on('destroy', (event, slick) => {
                this.zone.run(() => {
                    this.initialized = false;
                });
            });

            this.slideWrapper.slick({
                autoplaySpeed: 4000,
                lazyLoad: 'progressive',
                speed: 600,
                arrows: false,
                dots: true,
                mobileFirst: true,
                waitForAnimate: false,
                adaptiveHeight: true,
            });

        });

    }

    /**
     * @param  {any} player
     * @param  {any} command
     */
    postMessageToPlayer(player: any, command: any) {
        if (player == null || command == null) {
            return;
        }
        player.contentWindow.postMessage(JSON.stringify(command), '*');
    }

    /**
     * @param  {any} element
     * @param  {any} control
     */
    handleActionVideo(element: any, control: any) {

        let currentSlide = element.find('.slick-current');
        let slideType = currentSlide.children().children().attr('class').split(' ')[1];
        let player = currentSlide.find('iframe').get(0);

        if (this.isAutoPlay) {
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
            } else if (slideType === 'youtube') {
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
            } else if (slideType === 'video') {
                const video = currentSlide.children().children().children().children('video').get(0);
                if (video != null) {
                    if (control === 'play') {
                        video.play();
                    } else {
                        video.pause();
                    }
                }
            }
        }

    }

    /**
     * @param  {string} url
     * @param  {string} type
     */
    createSource(url: string, type: string) {
        const vimeoConfig = this.config['vimeo']['params'];
        const youtubeConfig = this.config['youtube']['params'];
        if (vimeoConfig && youtubeConfig) {
            switch (type) {
                case 'youtube': {
                    return `${url}?${this.queryParams(youtubeConfig)}`;
                }
                case 'vimeo': {
                    return `${url}?${this.queryParams(vimeoConfig)}`;
                }
            }
        }
    }

    /**
     * @param  {any} params
     */
    queryParams(params: any) {
        return Object.keys(params).map((key: any) => `${key}=${params[key]}`).join('&');
    }

    ngOnDestroy() {
        this.slideWrapper = undefined;
    }

    /**
     * @param  {string} label
     * @param  {any} data
     */
    debug(label: string, data: any) {
        console.log(`${this.packageName}: `, label, data);
    }

}
