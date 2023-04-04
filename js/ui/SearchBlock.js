/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
    constructor( element ) {
      this.element = element;
      this.registerEvents();
    }
  
    /**
     * Выполняет подписку на кнопки "Заменить" и "Добавить"
     * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
     * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
     */
    registerEvents(){
      const replace = this.element.querySelector('.replace');
      const add = this.element.querySelector('.add');
      const input = this.element.getElementsByTagName('input')[0];
      
      replace.addEventListener('click', () => {
        const id = input.value.trim();
        if (id) {
          App.imageViewer.clear();
          VK.get(id, App.imageViewer.drawImages);
        }
      });
  
      add.addEventListener('click', () => {
        const id = input.value.trim();
        if (id) {
          VK.get(id, App.imageViewer.drawImages);
        }
      });
    }
  }