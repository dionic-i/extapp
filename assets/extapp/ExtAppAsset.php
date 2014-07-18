<?php
/**
 * Description of BaseAsset.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru> 
 * @since: 23.05.14 10:40
 */

namespace dionici\extapp\assets\extapp;

use yii\web\AssetBundle;

class ExtAppAsset extends AssetBundle
{
	public $sourcePath = '@vendor/dionic-i/assets/extapp/resource';

	public function init()
	{
		// @todo: Сделать загрузку автоматом
		$this->js = [
			'TenClassManager',
			'TenMessage',
			'TenRequester',
			'TenUtil',

			'data/TenWideModel',
			'data/TenStore',
			'data/TenTreeStore'


		];
	}
}
