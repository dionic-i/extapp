<?php
/**
* Description of ExtApplicationWidget.
*
* @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
* @since: 16.07.14
*/

namespace dionici\extapp;

use yii\base\Widget;
use dionici\assets\extjs4\ExtAsset;
use dionici\assets\extapp\ExtAppAsset;

class ExtApplicationWidget extends Widget
{
	/**
	 * @var array
	 */
	public $path = [];

	/**
	 * @var array
	 */
	public $namespaces = [];

	private function registerScripts()
	{
		ExtAsset::register($this->view);
		ExtAppAsset::register($this->view);
	}

	public function init()
	{
		parent::init();
		$this->view = $this->getView();
	}

	public function run()
	{
		$this->registerScripts();

		$app = new ExtApplication([




		]);

		$appScript = $this->view->registerScript('application', $app->getJavascipt());
	}

}
