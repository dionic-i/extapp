<?php
/**
 * Description of EnPasswordConfirmField.
 *
 * @author: ${IAM} <${EMAIL}>
 * @since: 07.02.14 12:42
 */


class EnPasswordConfirmField extends ExtFormTextField
{
	public $initialPassField;

	public function initComponent()
	{
		parent::initComponent();
		$this->setListeners(array(
			'validitychange' => array(
				'fn' => new CJavaScriptExpression(
						'js:function(field) {
							if (field) {
								field.next().validate();
							}
						}'),
			),
			'blur'           => array(
				'fn' => new CJavaScriptExpression(
						'js:function(field) {
							if (field) {
								field.next().validate();
							}
						}'),
			)
		));
		$this->cmpClass = 'Ext.form.field.Text';
		$this->xtype    = 'textfield';
	}

} 