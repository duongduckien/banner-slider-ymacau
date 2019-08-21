import { NgZone, OnDestroy, OnChanges, AfterViewInit, AfterViewChecked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
export declare class BannerSliderComponent implements OnDestroy, OnChanges, AfterViewInit, AfterViewChecked {
    zone: NgZone;
    domSanitizer: DomSanitizer;
    config: any;
    slider: any;
    private slideWrapper;
    private lazyImages;
    private initialized;
    private packageName;
    constructor(zone: NgZone, domSanitizer: DomSanitizer);
    ngOnInit(): void;
    ngOnChanges(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    initSlider(): void;
    /**
     * @param  {any} player
     * @param  {any} command
     */
    postMessageToPlayer(player: any, command: any): void;
    /**
     * @param  {any} slick
     * @param  {any} control
     */
    handleActionVideo(element: any, control: any): void;
    /**
     * @param  {string} url
     * @param  {string} type
     */
    createSource(url: string, type: string): string;
    /**
     * @param  {any} params
     */
    queryParams(params: any): string;
    ngOnDestroy(): void;
    /**
     * @param  {string} label
     * @param  {any} data
     */
    debug(label: string, data: any): void;
}
