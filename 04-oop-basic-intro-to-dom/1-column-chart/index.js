export default class ColumnChart {
    _data;
    _label;
    _link;
    _value;
    chartHeight;
    formatHeading;
    element = document.createElement('div');

    constructor({ data = [], chartHeight = 50, label = 'orders', link = '', value = 0, formatHeading = data => `${data}` } = {}) {
        this._data = data;
        this.chartHeight = chartHeight;
        this._label = label;
        this._link = link;
        this._value = value;
        this.formatHeading = formatHeading;
        this._create();
    }

    _create() {
        this.element.classList.add('column-chart');
        if (this._data.length === 0) {
            this.element.classList.add('column-chart_loading');
        }
        this.element.style.setProperty("--chart-height", this.chartHeight);

        let innerHtml = `
            <div class="column-chart__title">
                Total ${this._label}
                ${this._addHref()}
            </div>
            <div class="column-chart__container">
                ${this._addCartHeader()}
                <div data-element="body" class="column-chart__chart">
                    ${this._addChart()}
                </div>
            </div>`;

        this.element.innerHTML = innerHtml;
    }

    _addHref() {
        return this._link !== '' ? `<a href="/${this._link}" class="column-chart__link">View all</a>` : '';
    }

    _addCartHeader() {
        return this._value !== 0 ? `<div data-element="header" class="column-chart__header">${this.formatHeading(this._value)}</div>` : '';
    }

    _addChart() {
        let maxValue = Math.max(...this._data);
        let scale = 50 / maxValue;

        return this._data.reduce((accumulator, item) => {
            let percent = (item / maxValue * 100).toFixed(0);
            let value = Math.floor(item * scale);

            accumulator = accumulator + `<div style="--value: ${value}" data-tooltip="${percent}%"></div>`

            return accumulator;
        },
            '');
    }

    update(data) {
        this._data = data;
        this._create();
    }

    destroy() {
        console.log('This is a stub for the destroy() method')
    }

    remove() {
        this.element.remove();
    }
}
