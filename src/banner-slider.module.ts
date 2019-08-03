import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerSliderComponent } from './components/banner-slider';
import { BannerSliderService } from './services/banner-slider.service';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        BannerSliderComponent,
        SafePipe,
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

