<?php
/**
 * Description of BaseAsset.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru> 
 * @since: 23.05.14 10:40
 */

namespace dionici\extapp\assets\extjs4;

use yii\web\AssetBundle;

class ExtAsset extends AssetBundle
{
	public $sourcePath = '@vendor/dionic-i/assets/extjs4/ext-4.2.1-gpl';

	/**
	 * @var string
	 */
	public $theme = 'classic';

	public function init()
	{
		if (YII_DEBUG)
		{
			$this->js[]  = 'ext-all-debug.js';
			$this->css[] = 'resource/ext-theme-' . $this->theme . '/' . 'ext-theme-' . $this->theme . '-all-debug.css';
		}
		else
		{
			$this->js[]  = 'ext-all.js';
			$this->css[] = 'resource/ext-theme-' . $this->theme . '/' . 'ext-theme-' . $this->theme . '-all.css';
		}

		$this->js[]  = 'ext-theme-' . $this->theme . '.js';
	}
}
