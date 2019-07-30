import { Observable } from 'rxjs';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { BannerSliderComponent } from './components/banner-slider';
import { BannerSliderService } from './services/banner-slider.service';

@NgModule({
    declarations: [
        BannerSliderComponent,
    ],
    exports: [
        BannerSliderComponent,
    ],
})
export class BannerSliderYMacauModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: BannerSliderYMacauModule,
            providers: [BannerSliderService],
        };
    }
}

