<?php
/**
 * Description of EnBaseWindow.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 05.03.14 16:45
 */

class EnBaseWindow extends EnUniversal
{
	public function initComponent()
	{
		parent::initComponent();
		$this->xtype = 'winbase';

		$this->tbar           = new ExtToolbar(array(
			'xtype'    => 'toolbar',
			'itemId'   => 'wintoolbar',
			'defaults' => array('xtype' => 'button'),
			'items'    => array(
				array('xtype' => 'tbfill'),
				array(
					'iconCls' => 'i_exit',
					'itemId'  => 'i_exit',
					'tooltip' => 'Выход',
					'handler' => 'acExit'
				)
			)
		));
		$this->suspendProps[] = 'tbar';

		Ext::applyIf($this, array(
			'title'       => 'Информация',
			'modal'       => TRUE,
			'width'       => 400,
			'height'      => 400,
			'minimizable' => FALSE,
			'maximizable' => FALSE
		));
	}

}
