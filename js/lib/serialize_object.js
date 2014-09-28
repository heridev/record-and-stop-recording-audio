$.fn.serializeObject = function() {
  var a, o;
  a = void 0;
  o = void 0;
  o = {};
  a = this.serializeArray();
  $.each(a, function() {
    var _ref;
    _ref = void 0;
    if (/phone|ssn/.test(this.name)) {
      this.value = ((_ref = this.value.match(/\d/g)) != null ? _ref.join("") : void 0);
    }
    if (/true|false/.test(this.value)) {
      this.value = this.value === "true";
    }
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      return o[this.name].push(this.value || "");
    } else {
      return o[this.name] = this.value || "";
    }
  });
  return o;
};

