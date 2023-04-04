/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
    constructor( element ) {
      super(element);
      this.showImages = this.showImages.bind(this);
      this.registerEvents();
    }
  
    /**
     * Добавляет следующие обработчики событий:
     * 1. Клик по крестику на всплывающем окне, закрывает его
     * 2. Клик по контроллерам изображения: 
     * Отправляет запрос на удаление изображения, если клик был на кнопке delete
     * Скачивает изображение, если клик был на кнопке download
     */
    registerEvents() {
      let that = this;
      const xIcon = this.dom.getElementsByTagName('i')[0]
      xIcon.addEventListener('click', (e) => {
        that.close();
      });
  
      
  
      const contentBlock = this.dom.querySelector('.content');
      contentBlock.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
          const parent = e.target.closest('.image-preview-container');
          parent.querySelector('.trash').classList.add('icon', 'spinner', 'loading');
          e.target.classList.add('disabled');
          const path = e.target.dataset.path;
          
          function deleteBlock(err, response) {
            if (err == null) {
              parent.remove();
            }
          }
          Yandex.removeFile(path, deleteBlock);
        } else if (e.target.classList.contains('download')) {
          // const parent = e.target.closest('.image-preview-container');
          // const url = parent.getElementsByTagName('img')[0].src;
          const url = e.target.dataset.file;
          Yandex.downloadFileByUrl(url);
        }
      });
    }
  
  
    /**
     * Отрисовывает изображения в блоке всплывающего окна
     */
    showImages(err, data) {
      const images = data.items;
      images.reverse();
      let blocks = [];
      for (let img of images) {
        const block = this.getImageInfo(img);
        blocks.push(block);
      }
      const contentBlock = this.dom.querySelector('.content');
      contentBlock.innerHTML = blocks.join('');
    }
  
    /**
     * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
     * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
     * */
    formatDate(date) {
      const d = new Date(date);
      const day = d.getDate();
      const year = d.getFullYear();
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const months = {
        0: 'январь', 
        1: 'февраль', 
        2: 'март', 
        3: 'апрель', 
        4: 'май', 
        5: 'июнь', 
        6: 'июль', 
        7: 'август', 
        8: 'сентябрь', 
        9: 'октябрь', 
        10: 'ноябрь', 
        11: 'декабрь'
      }
      const month = months[d.getMonth()];
      return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
    }
  
    /**
     * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
     */
    getImageInfo(item) {
      let that = this;
      const div = document.createElement('div');
      div.classList.add('image-preview-container');
  
      const img = document.createElement('img');
      img.src = item.preview;
      div.appendChild(img);
  
      const table = document.createElement('table');
      table.classList.add('ui', 'celled', 'table');
  
      const thead = document.createElement('thead');
      const tr1 = document.createElement('tr');
  
      const th1 = document.createElement('th');
      th1.innerHTML = 'Имя';
      const th2 = document.createElement('th');
      th2.innerHTML = 'Создано';
      const th3 = document.createElement('th');
      th3.innerHTML = 'Размер';
      tr1.appendChild(th1);
      tr1.appendChild(th2);
      tr1.appendChild(th3);
      thead.appendChild(tr1);
      table.appendChild(thead);
  
      const tbody = document.createElement('tbody');
      const tr2 = document.createElement('tr');
  
      const td1 = document.createElement('td');
      td1.append(item.name);
      const td2 = document.createElement('td');
      td2.append(that.formatDate(item.created));
      const td3 = document.createElement('td');
      const size = item.size;
      td3.append((size/1024).toFixed(1) + 'Кб');
      tr2.appendChild(td1);
      tr2.appendChild(td2);
      tr2.appendChild(td3);
      tbody.appendChild(tr2);
      table.appendChild(tbody);
      div.appendChild(table);
  
      const iTrash = document.createElement('i');
      iTrash.classList.add('trash', 'icon');
      const btnDelete = document.createElement('button');
      btnDelete.classList.add('ui', 'labeled', 'icon', 'red', 'basic', 'button', 'delete');
      btnDelete.dataset.path = item.path;
      btnDelete.append('Удалить');
      btnDelete.appendChild(iTrash);
  
      const iDownload = document.createElement('i');
      iDownload.classList.add('download', 'icon');
      const btnDownload = document.createElement('button');
      btnDownload.classList.add('ui', 'labeled', 'icon', 'violet', 'basic', 'button', 'download');
      btnDownload.dataset.file = item.file;
      btnDownload.append('Скачать');
      btnDownload.appendChild(iDownload);
  
      const divBW = document.createElement('div');
      divBW.classList.add('buttons-wrapper');
      divBW.appendChild(btnDelete);
      divBW.appendChild(btnDownload);
      div.appendChild(divBW);
  
      const str = div.outerHTML;
      return str;
    }
  }