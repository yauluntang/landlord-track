import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment-timezone";
import { DomSanitizer } from '@angular/platform-browser';
import { Tenant } from './user.service';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(url) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}


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
        value = "sms://+1"+value;
        return value
    }
    else {
        return "";
    }
  }
}

@Pipe({name: 'dueSort'})
export class DueSortPipe implements PipeTransform {
  transform(allTenant: Tenant[], length): Tenant[] {

    if ( allTenant ){
      allTenant.sort( ( a, b )=> { 
        console.log( a );
        console.log( b );
        if ( a.dueDate && b.dueDate ){
          console.log( moment( a.dueDate ).valueOf() );
          console.log( moment( b.dueDate ).valueOf() );
          return  moment( a.dueDate ).diff( moment( b.dueDate ) ) 
        }
        else {
          return 0;
        }
      });
    }
    console.log( allTenant);
    return allTenant;
  }
}


@Pipe({name: 'totalrent'})
export class TotalRentPipe implements PipeTransform {
  transform(allTenant: Tenant[], length): number{
   
    if ( allTenant ){
      console.log('tenants', allTenant)
      return allTenant.reduce((a,x)=>{
        
        console.log( a, x.rent );
        return a + x.rent;

      } ,0);
    }
    else {
      console.log('no tenant yet')
    }
    return 0;
  }
}