/*
 * ДАННЫЕ ПРОДАВЦА — заполните один раз, они подставятся на все страницы сайта
 * (главная, оферта, возврат). Пустые поля остаются выделенными «[…]».
 * Отредактировать можно прямо на GitHub: откройте этот файл → значок карандаша → «Commit changes».
 */
window.SELLER = {
  name:   "",   // ФИО полностью, например: Иванов Иван Иванович
  status: "",   // «самозанятый (плательщик налога на профессиональный доход)» или «индивидуальный предприниматель»
  inn:    "",   // ИНН, 12 цифр
  ogrnip: "",   // ОГРНИП — только для ИП, самозанятым оставьте пустым
  email:  "",   // почта для покупателей, например: rubezh.support@mail.ru
  phone:  "",   // телефон — необязательно
  city:   ""    // город — необязательно
};

(function () {
  var s = window.SELLER;
  document.querySelectorAll("[data-seller]").forEach(function (el) {
    var v = (s[el.getAttribute("data-seller")] || "").trim();
    if (v) {
      el.textContent = v;
      el.classList.remove("fill");
      if (el.tagName === "A" && el.getAttribute("data-seller") === "email") el.href = "mailto:" + v;
    }
  });
  // строки, у которых поле не нужно (например, ОГРНИП у самозанятого), прячем
  document.querySelectorAll("[data-seller-row]").forEach(function (row) {
    if (!(s[row.getAttribute("data-seller-row")] || "").trim()) row.style.display = "none";
  });
})();
