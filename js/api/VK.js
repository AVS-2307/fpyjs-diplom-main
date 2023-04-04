/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = '27bad9b427bad9b427bad9b43f24a8e3fb227ba27bad9b4447829d2307dbddfbfb37fa1';
  static lastCallback;
  static BaseUrl = 'https://api.vk.com/method/'
  
  /**
   * Получает изображения
   * */
  static get(id = '', callback){
    this.lastCallback = callback;
    const script = document.createElement('script');
    script.id = 'addedScript';
    script.src = this.BaseUrl + 'photos.get?owner_id=' + id + '&album_id=profile&access_token=' + this.ACCESS_TOKEN + '&rev=1&v=5.131&callback=VK.processData';
    document.getElementsByTagName('body')[0].appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){
    document.getElementById('addedScript').remove();
    result.onerror = () => {
      alert('Не удалось загрузить скрипт!');
      return;
    };
    let images = [];
    const types = ['w', 'z', 'y', 'x', 'r', 'q', 'p', 'm', 'o', 's'];
    

    function biggest(sizes) {
      for (let type of types) {
        for (let size of sizes) {
          if (type === size.type) {
            return size;
          }
        }
      }
    }

    for (let img of result.response.items) {
      img['sizes'] = biggest(img['sizes']);
    }

    let choosedImages = [];
    for (let item of result.response.items) {
      choosedImages.push(item.sizes.url);
    }
    
    this.lastCallback(choosedImages);
    this.lastCallback = () => {};
  }
}
