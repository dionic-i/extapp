/**
 * Description of TenDaemonForm.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 21.02.14 10:55
 */

Ext.define('TenDaemonForm', {
	extend: 'Common.form.TenBaseForm',
	alias : 'widget.endaemonform',

	acManageDaemon: function (btn) {
		var me = this,
			data;

		data = App.Req.sync({actionUrl: btn.endata});

		console.log(data);
	}

});
