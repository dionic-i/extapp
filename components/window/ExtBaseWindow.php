<?php
/**
 * Description of EnBaseWindow
 * Класс окна со стандартными настройками для окон приложения.
 *
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 21.06.2013
 */

class ExtBaseWindow extends ExtWindow
{
	public function initComponent()
	{
		parent::initComponent();
		Ext::applyIf($this, array(
			'constrain'   => FALSE,
			'resizable'   => TRUE,
			'minimizable' => TRUE,
			'maximizable' => TRUE,
			'collapsable' => FALSE,
			'closable'    => FALSE,
			'autoShow'    => TRUE,
			'layout'      => 'fit',
			'plain'       => FALSE,
			'shadow'      => FALSE,
			'seq'         => EnUtil::getUid('window')
		));
	}
}

