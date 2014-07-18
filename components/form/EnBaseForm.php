<?php
/**
 * Description of EnBaseForm.
 * Базовый класс формы.
 * Соответствует Common.form.TenBaseForm, в котором происходит привязка обработчиков событий кнопок, если они есть.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 21.02.14 10:21
 */

class EnBaseForm extends ExtFormPanel
{
	public function initComponent()
	{
		parent::initComponent();
		$this->cmpClass = 'Common.form.TenBaseForm';
		$this->xtype    = 'enbaseform';
	}
}
