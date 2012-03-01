PHM javascript framework documentation
======================================
#About
This framework is a simple prototype framework for creating and managing rich JS web client apps

##Web Application structure
PHM framework provides a specific application structure that consists of:

  - Widgets

        PHM.app.widgetClasses - widget classes available in your application
        PHM.app.widgets - currently created widgets
  - Controls

        PHM.ui.Library - list of available controls
  - Behaviors

        PHM.app.behaviors - main application logic goes here
  - Events Dispatcher

        PHM.app.eventsList - currently subscribed events handlers
  - Server API

        PHM.server
  - Storage (models persistance)
        PHM.app.models
        PHM.app.db

##Widgets
To define a simple widget class:

    class MyWidget extends PHM.ui.Widget
    PHM.app.registerWidgetClass("my_widget_class_name", MyWidget)

Currently we use [haml-js](https://github.com/creationix/haml-js) for client side templates. It converts templates to
JS functions and wraps them into JST namespace.
You can use any templating engine thought. Just define PHM.ui.templateStorage
method to return a template storage object you want.

In order to add widget to your application you can use either:
    PHM.app.addWidget(String widgetClassName, Object Selector)
Ex.
    PHM.app.addWidget("my_widget_class_name", PHM.ui.getSelector('my-widget-placeholder'))

