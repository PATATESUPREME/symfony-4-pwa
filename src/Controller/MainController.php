<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class MainController.
 */
class MainController extends AbstractController
{
    /**
     * @Route("/", name="homepage")
     */
    public function index()
    {
        return $this->render('main/index.html.twig', [
            'controller_name' => 'MainController',
        ]);
    }

    /**
     * @Route("/offline", name="offline")
     */
    public function offlineAction()
    {
        return $this->render('main/offline.html.twig');
    }

    /**
     * @Route("/test", name="test")
     */
    public function testAction()
    {
        return $this->render('main/test.html.twig');
    }

    /**
     * @Route("/not-cached", name="not-cached")
     */
    public function notCachedAction()
    {
        return $this->render('main/not-cached.html.twig');
    }
}
