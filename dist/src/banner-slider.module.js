var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { BannerSliderComponent } from './components/banner-slider';
import { BannerSliderService } from './services/banner-slider.service';
var BannerSliderYMacauModule = /** @class */ (function () {
    function BannerSliderYMacauModule() {
    }
    BannerSliderYMacauModule_1 = BannerSliderYMacauModule;
    BannerSliderYMacauModule.forRoot = function () {
        return {
            ngModule: BannerSliderYMacauModule_1,
            providers: [BannerSliderService],
        };
    };
    var BannerSliderYMacauModule_1;
    BannerSliderYMacauModule = BannerSliderYMacauModule_1 = __decorate([
        NgModule({
            declarations: [
                BannerSliderComponent,
            ],
            exports: [
                BannerSliderComponent,
            ],
        })
    ], BannerSliderYMacauModule);
    return BannerSliderYMacauModule;
}());
export { BannerSliderYMacauModule };
//# sourceMappingURL=banner-slider.module.js.map