import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment-timezone";


@Pipe({name: 'datePipe'})
export class DatePipe implements PipeTransform {
  transform(value: Date): string {
    if ( value ){
        return moment(value).tz('America/New_York').format('YYYY-MM-DD');
    }
    return "";
  }
}

@Pipe({name: 'currencyPipe'})
export class CurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if ( value !== null && typeof value !== 'undefined' && !isNaN(value) ){
        return "$"+value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return "";
  }
}

@Pipe({name: 'phone'})
export class PhonePipe implements PipeTransform {
  transform(value: string): string {

    if ( value ){
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        return value;
    }
    else {
        return "";
    }
  }
}

@Pipe({name: 'sms'})
export class SmsPipe implements PipeTransform {
  transform(value: string): string {

    if ( value ){
        value = "sms:+"+value;
    }
    else {
        return "";
    }
  }
}