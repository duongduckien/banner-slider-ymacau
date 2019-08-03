import {
    Component,
    NgZone,
    Input,
    ElementRef,
    OnDestroy,
    OnChanges,
    AfterViewInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

declare const jQuery: any;

@Component({
    selector: 'banner-slider-ymacau',
    templateUrl: 'banner-slider.html',
    styleUrls: ['banner-slider.scss']
})
export class BannerSliderComponent implements OnDestroy, OnChanges, AfterViewInit {

    @Input() config: any;
    @Input() slider: any;

    private slideWrapper: any;
    private lazyImages: any;

    constructor(
        public zone: NgZone,
        public domSanitizer: DomSanitizer,
    ) {

    }

    ngOnInit() {

    }

    ngOnChanges() {

    }

    ngAfterViewInit(): void {

        if (this.slider.length > 0) {

            this.slideWrapper = jQuery('.main-slider');
            this.lazyImages = this.slideWrapper.find('.slide-image');

            this.zone.runOutsideAngular(() => {

                this.slideWrapper.on('init', (el: any) => {
                    this.zone.run(() => {
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
                        this.handleActionVideo(el, 'play');
                    });
                });

                this.slideWrapper.on('lazyLoaded', (el: any) => {
                    this.zone.run(() => {
                        this.lazyImages.addClass('show');
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
     * @param  {any} slick
     * @param  {any} control
     */
    handleActionVideo(element: any, control: any) {

        let currentSlide = element.find('.slick-current');
        let slideType = currentSlide.children().children().attr('class').split(' ')[1];
        let player = currentSlide.find('iframe').get(0);

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
                        'func': 'mute',
                    });
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

    queryParams(params: any) {
        return Object.keys(params).map((key: any) => `${key}=${params[key]}`).join('&');
    }

    ngOnDestroy() {

    }

}
