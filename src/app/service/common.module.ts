import { NgModule } from '@angular/core';
import { DatePipe, CurrencyPipe, PhonePipe, SmsPipe, SafeUrlPipe, DueSortPipe, TotalRentPipe } from './datepipe.pipe';


@NgModule({
  providers: [],
  declarations: [DatePipe, CurrencyPipe, PhonePipe, SmsPipe, SafeUrlPipe, DueSortPipe, TotalRentPipe],
  exports:[DatePipe, CurrencyPipe, PhonePipe, SmsPipe, SafeUrlPipe, DueSortPipe, TotalRentPipe]
})
export class CommonAppModule {}
