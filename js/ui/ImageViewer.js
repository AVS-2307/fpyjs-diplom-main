/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
    constructor( element ) {
      this.element = element;
      this.imagesList = element.querySelector('.images-list .grid .row');
      this.imagePreview = element.getElementsByTagName('img')[0];
      
      this.drawImages = this.drawImages.bind(this);
      this.registerEvents();
    }
  
    /**
     * Добавляет следующие обработчики событий:
     * 1. Клик по изображению меняет класс активности у изображения
     * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
     * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
     * Добавляет или удаляет класс активности у всех изображений
     * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
     * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
     */
    registerEvents(){
      let that = this;
      this.imagesList.addEventListener('dblclick', (e) => {
        if (e.target.tagName == 'IMG') {
          that.imagePreview.src = e.target.src;
        }
      });
  
      this.imagesList.addEventListener('click', (e) => {
        if (e.target.tagName == 'IMG') {
          e.target.classList.toggle('selected');
          that.checkButtonText();
        }
      });
  
      document.querySelector('.select-all').addEventListener('click', () => {
        const images = this.imagesList.getElementsByTagName('img');
        let check = 0;
        for (let img of images) {
          if (img.classList.contains('selected')) {
            check += 1;
          }
        }
  
        if (check === images.length) {
          for (let img of images) {
            img.classList.remove('selected');
          }
        } else {
          for (let img of images) {
            if (!img.classList.contains('selected')) {
              img.classList.add('selected');
            }
          }
        }
        this.checkButtonText();
      });
  
      document.querySelector('.show-uploaded-files').addEventListener('click', () => {
        const previewer = App.getModal('filePreviewer');
        previewer.open();
        const i = document.querySelector('.asterisk.loading.icon.massive');
        const images = Yandex.getUploadedFiles(previewer.showImages);
      });
  
      document.querySelector('.send').addEventListener('click', () => {
        const uploader = App.getModal('fileUploader');
        const selected = Array.from(this.imagesList.getElementsByClassName('selected'));
        uploader.open();
        uploader.showImages(selected);
      });
    }
  
    /**
     * Очищает отрисованные изображения
     */
    clear() {
      while (this.imagesList.firstChild) {
        this.imagesList.removeChild(this.imagesList.firstChild);
      }
    }
  
    /**
     * Отрисовывает изображения.
    */
    
    drawImages(images) {
      if (images) {
        document.querySelector('.select-all').classList.remove('disabled');
        for (let el of images) {
          const img = document.createElement('img');
          img.src = el;
  
          const div = document.createElement('div');
          div.classList.add('four', 'wide', 'column', 'ui', 'medium', 'image-wrapper');
        
          div.appendChild(img);
          this.imagesList.appendChild(div);
        }
      } else {
        document.querySelector('.select-all').classList.add('disabled');
      }
    }
  
    /**
     * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
     */
    checkButtonText(){
      const images = this.imagesList.getElementsByTagName('img');
      const selectAll = document.querySelector('.select-all');
      const send = document.querySelector('.send');
      let checkForSelect = 1;
      let checkForSend = 0;
      for (let img of images) {
        if (!img.classList.contains('selected')) {
          checkForSelect = 0;
        } else {
          checkForSend = 1;
        }
      }
      if (checkForSelect && images) {
        selectAll.textContent = 'Снять выделение';
      } else {
        selectAll.textContent = 'Выбрать всё';
      }
  
      if (checkForSend) {
        send.classList.remove('disabled');
      } else {
        send.classList.add('disabled');
      }
    }
  }