import { PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
export declare class SafePipe implements PipeTransform {
    sanitizer: DomSanitizer;
    constructor(sanitizer: DomSanitizer);
    transform(url: string): import("@angular/platform-browser/src/security/dom_sanitization_service").SafeResourceUrl;
}
