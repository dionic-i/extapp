<?php
/**
 * Description of EnLoginWindow
 * Окно для логинизации в системе.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 21.06.2013
 */



class EnLoginWindow extends ExtBaseWindow
{
	/**
	 * @var string
	 */
	public $loginUrl;

	public function initComponent()
	{
		parent::initComponent();
		// todo: Добавить построение формы в данном окне

		Ext::apply($this, array(
			'xtype'       => 'winlogin',
			'title'       => 'Вход в систему',
			'height'      => 150,
			'width'       => 320,
			'modal'       => TRUE,
			'resizable'   => FALSE,
			'minimizable' => FALSE,
			'maximizable' => FALSE
		));
	}
}
