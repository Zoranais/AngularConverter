import { Component, OnDestroy } from '@angular/core';
import { Currency } from 'src/app/models/currency';
import { ExchangeRatesService } from 'src/app/services/exchange-rates.service';
import { Subject, takeUntil } from 'rxjs';
import { CurrencyCodes } from 'src/app/currency-code-constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnDestroy {
  public currenciesToDisplay: Currency[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(private rateService: ExchangeRatesService) {
    rateService.getExchangeRates()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(rates => 
      this.currenciesToDisplay = rates
      .filter(x => x.cc === CurrencyCodes.EUR || x.cc === CurrencyCodes.USD
    ));
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
