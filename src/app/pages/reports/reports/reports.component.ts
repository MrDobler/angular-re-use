import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from '../../entries/shared/entry.model';
import { EntryService } from '../../entries/shared/entry.service';

import currencyFormatter from 'currency-formatter';


@Component({
    selector: "app-reports",
    templateUrl: "./reports.component.html",
    styleUrls: ["./reports.component.css"]
})
export class ReportsComponent implements OnInit {
    isLoading = false;
    breadCrumb = [{ text: 'Relatório de Receitas e Despesas' }];
    
    expenseTotal: any = 0;
    revenueTotal: any = 0;
    balance: any = 0;

    expenseChartData: any;
    revenueChartData: any;

    chartOptions = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    categories: Category[] = [];
    entries: Entry[] = [];

    @ViewChild('month') month: ElementRef = null;
    @ViewChild('year') year: ElementRef = null;

    constructor(private entryService: EntryService, private categoryService: CategoryService) {}

    ngOnInit() {
        this.isLoading = true;
        this.categoryService.all()
            .subscribe(categories => {
                this.categories = categories;
                this.isLoading = false;
            });
    }

    generateReports() {
        const month = this.month.nativeElement.value;
        const year = this.year.nativeElement.value;

        if (!month || !year) {
            alert('Selecione Mês e Ano corretamente');
        } else {
            this.isLoading = true;
            this.entryService.getByMonthAndYear(month, year).subscribe(function () {
                this.setValues.bind(ReportsComponent);
                this.isLoading = false;
            });
        }
    }

    private setValues(entries: Entry[]) {
        this.entries = entries;
        this.calculateBalance();
        this.setChartData();
    }

    private calculateBalance() {
        const BRL = { code: 'BRL' };
        let mExpenseTotal = 0;
        let mRevenueTotal = 0;

        this.entries.forEach(entry => {
            if (entry.type == 'revenue') {
                mRevenueTotal += currencyFormatter.unformat(entry.amount, BRL);
            } else {
                mExpenseTotal += currencyFormatter.unformat(entry.amount, BRL);
            }
        });

        this.expenseTotal = currencyFormatter.format(mExpenseTotal, BRL);
        this.revenueTotal = currencyFormatter.format(mRevenueTotal, BRL);
        this.balance = currencyFormatter.format(mRevenueTotal - mExpenseTotal, BRL);
    }

    private setChartData() {
        this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65');
        this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#E03131');
    }

    private getChartData(entryType: string, title: string, color: string) {
        const BRL = { code: 'BRL' };
        const chartData = [];

        this.categories.forEach(category => {
            const filteredEntries = this.entries.filter(
                entry => (entry.category_id == category.id) && (entry.type == entryType)
            );

            if (filteredEntries.length > 0) {
                const totalAmount = filteredEntries.reduce(
                    (total, entry) => total + currencyFormatter.unformat(entry.amount, BRL), 0
                );

                chartData.push({
                    categoryName: category.name,
                    totalAmount: totalAmount
                });
            }
        });

        return {
            labels: chartData.map(item => item.categoryName),
            datasets: [{
                label: title,
                background: color,
                data: chartData.map(item => item.totalAmount)
            }]
        };
    }
}
