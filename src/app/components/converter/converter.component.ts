import { Component, OnDestroy } from '@angular/core';
import { Currency } from 'src/app/models/currency';
import { ExchangeRatesService } from 'src/app/services/exchange-rates.service';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrencyCodes } from 'src/app/currency-code-constants';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.sass'],
})
export class ConverterComponent implements OnDestroy {
  public rates: Currency[] = [];
  public form: FormGroup | undefined = undefined;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private rateService: ExchangeRatesService,
    private fb: FormBuilder
  ) {
    rateService
      .getExchangeRates()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((rates) => {
        this.rates = rates
          .concat({ cc: 'UAH', rate: 1 } as Currency)
          .sort((a, b) => a.cc.localeCompare(b.cc));
        this.initForm();
      });
  }

  public onFromChanged() {
    let fromCode = this.form?.get('from.cc')?.value;
    let toCode = this.form?.get('to.cc')?.value;
    let fromValue = this.form?.get('from.value')?.value;

    const rate = this.rateService.convertFromTo(fromCode, toCode, this.rates);

    this.form?.patchValue({ to: { value: (fromValue / rate).toFixed(3) } });
  }

  public onToChanged() {
    let fromCode = this.form?.get('to.cc')?.value;
    let toCode = this.form?.get('from.cc')?.value;
    let fromValue = this.form?.get('to.value')?.value;

    const rate = this.rateService.convertFromTo(fromCode, toCode, this.rates);

    this.form?.patchValue({ from: { value: (fromValue / rate).toFixed(3) } });
  }

  public reverse() {
    const fromCode = this.form?.get('from.cc')?.value;
    const toCode = this.form?.get('to.cc')?.value;
    const fromValue = this.form?.get('from.value')?.value;
    const toValue = this.form?.get('to.value')?.value;

    this.form?.patchValue({
      from: {
        cc: toCode,
        value: toValue,
      },
      to: {
        cc: fromCode,
        value: fromValue,
      },
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initForm() {
    this.form = this.fb.group({
      from: this.fb.group({
        cc: this.rates.filter((x) => x.cc === CurrencyCodes.UAH)[0].cc,
        value: 1,
      }),
      to: this.fb.group({
        cc: this.rates.filter((x) => x.cc === CurrencyCodes.USD)[0].cc,
        value: 1,
      }),
    });

    this.onFromChanged();
  }
}
