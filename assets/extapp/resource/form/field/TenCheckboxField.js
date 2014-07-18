/**
 * Description of TenCheckboxField.
 * Переопределили класс поля с чекбоксом, чтобы он отдавал значение поля при снятом флажке.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 27.05.14 13:11
 */

Ext.define('Common.form.fields.TenCheckboxField', {
	extend: 'Ext.form.field.Checkbox',
	alias : 'widget.encheckboxfield',
	withUncheck: true,

	/**
	 * Returns the checked state of the checkbox.
	 * @return {Boolean} True if checked, else false
	 */
	getValue: function() {
		return this.withUncheck ? this.getSubmitValue() : this.getValue();
	}
});
	