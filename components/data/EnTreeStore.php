<?php
/**
 * Description of EnTreeStore.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 16.07.13 13:20
 */

class EnTreeStore extends ExtTreeStore
{
	public function initComponent()
	{
		parent::initComponent();
		$this->cmpClass = 'Common.data.TenTreeStore';
	}
}
