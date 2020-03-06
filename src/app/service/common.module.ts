import { NgModule } from '@angular/core';
import { DatePipe, CurrencyPipe, PhonePipe, SmsPipe } from './datepipe.pipe';


@NgModule({
  providers: [],
  declarations: [DatePipe, CurrencyPipe, PhonePipe, SmsPipe],
  exports:[DatePipe, CurrencyPipe, PhonePipe, SmsPipe]
})
export class CommonAppModule {}
