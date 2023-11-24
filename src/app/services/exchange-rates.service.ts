import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { CurrencyCodes } from '../currency-code-constants';
import { Currency } from '../models/currency';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  constructor(private httpClient: HttpClient) { }

  public getExchangeRates(): Observable<Currency[]>  {
    return this.httpClient.get<Currency[]>(`${environment.apiUrl}`);
  }

  public convertFromTo(from: string, to: string, rates: Currency[]){
    if(from === CurrencyCodes.UAH){
      const rate = rates.filter(x => x.cc === to);
      return rate.length > 0 ? rate[0].rate : 0;
    }
    else {
      const fromRate = rates.filter(x => x.cc === from)[0].rate;
      const toRate = rates.filter(x => x.cc === to)[0].rate;

      if(!fromRate || !toRate){
        return 0;
      }

      return fromRate / toRate;
    }
    
  }
}
