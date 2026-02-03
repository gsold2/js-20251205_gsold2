export default class SortableTable {
  #headerConfig;
  #data;
  #sorted;
  #sortLocally;
  #element;

  constructor(headerConfig, { data = [], sorted = {} } = {}, sortLocally = true) {
    this.#headerConfig = headerConfig;
    this.#data = data;
    this.#sorted = sorted;
    this.#sortLocally = sortLocally;

    this.#createElemente();
    this.sort(this.#sorted.id, this.#sorted.order);

    this.#elementHeader().onclick = this.#onClick.bind(this);
  }

  #createElemente() {
    const tmp = document.createElement('div');
    tmp.innerHTML = this.#template();
    this.#element = tmp.firstElementChild;
  }

  #template() {
    return `
    <div class="sortable-table">
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.#headersTemplate()}
      </div>

      <div data-element="body" class="sortable-table__body">
        ${this.#rowsTemplate()}
      </div>
    </div>`;
  }

  #headersTemplate() {
    return this.#headerConfig
      .map(({ id, title, sortable }) => `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" ${this.#addDataOrderIfExist(id)}>
          <span>${title}</span>
          ${this.#addArrowIfExist(id)}
        </div>
      `)
      .join('\n');
  }

  #addDataOrderIfExist(id) {
    if (id === this.#sorted.id) {
      return `data-order = "${this.#sorted.order}"`;
    } else {
      return '';
    }
  }

  #addArrowIfExist(id) {
    if (id === this.#sorted.id) {
      return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
        `;
    } else {
      return '';
    }
  }

  #rowsTemplate() {
    let headersId = this.#headersId();

    return this.#data
      .map((row) => `
        <div class="sortable-table__row">
          ${headersId
          .map(headerId => '<div class="sortable-table__cell">' + this.#addCell(row, headerId) + '</div>')
          .join('\n')
        }
        </div>
      `)
      .join('\n');
  }

  #addCell(row, headerId) {
    if (headerId !== 'images') {
      return row[headerId];
    } else {
      return `<img class="sortable-table-image" alt="Image" src="${row[headerId][0].url}">`;
    }
  }

  #headersId() {
    return this.#headerConfig
      .map(header => header.id);
  }

  #sortRows(header, direction) {
    if (this.#sortLocally === true) {
      let { title, sortable, sortType } = this.#headerConfig.filter(e => e.id === header)[0];
      if (sortable === false) throw new TypeError(`Column with title '${title}' is not sortable`);

      if (sortType === 'number') {
        this.#data.sort((a, b) => direction * (a[header] - b[header]));
      } else if (sortType === 'string') {
        this.#data.sort((a, b) => direction * (a[header].localeCompare(b[header], ['ru', 'en'], { caseFirst: 'upper' })));
      } else {
        throw new TypeError(`Invalide sortType '${sortType}'. It should be 'number' or 'string'`);
      }
    } else {
      throw new Error('Sorting on the server is not possible');
    }

    let body = this.#elementBody();
    body.innerHTML = this.#rowsTemplate();
  }

  #elementHeader() {
    return this.#element.querySelector('[data-element="header"]');
  }

  #elementBody() {
    return this.#element.querySelector('[data-element="body"]');
  }

  #onClick(event) {
    let id = event.target.closest('.sortable-table__cell').dataset.id;
    if (this.#sorted.id !== id) {
      this.#sorted.id = id;
      this.#sorted.order = 'asc';
    } else {
      this.#sorted.order = this.#sorted.order === 'asc' ? 'desc' : 'asc';
    }

    this.sort(this.#sorted.id, this.#sorted.order);
    let header = this.#elementHeader();
    header.innerHTML = this.#headersTemplate();
  }

  destroy() {
    this.#element.remove();
  }

  sort(header, param = 'asc') {
    let headersId = this.#headersId();
    if (headersId.includes(header)) {
      if (param === 'asc') {
        this.#sortRows(header, 1);
      } else if (param === 'desc') {
        this.#sortRows(header, -1);
      } else {
        throw new TypeError(`Invalide param '${param}'. It should be 'asc' or 'desc'`);
      }
    }
  }

  get element() {
    return this.#element;
  }

  get subElements() {
    return {
      header: this.#elementHeader(),
      body: this.#elementBody()
    };
  }
}
