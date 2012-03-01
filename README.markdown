PHM javascript framework documentation
======================================
#About
This framework is a simple prototype framework for creating and managing rich JS web client apps
##Web Application structure
PHM framework provides a specific application structure that consists of:

  - Widgets  
        `PHM.app.widgetClasses - widget classes available in your application`
        `PHM.app.widgets - currently created widgets`
  - Controls  
        `PHM.ui.Library - list of available controls`
  - Behaviors  
        `PHM.app.behaviors - main application logic goes here`
  - Events Dispatcher  
        `PHM.app.eventsList - currently subscribed events handlers`
  - Server API  
        `PHM.server`
  - Storage (models persistance)  
        `PHM.app.models`
        `PHM.app.db`

##DOM manipulation and selectors
  To separate CSS and JS DOM manipulation a specific attribute is used.  
  `PHM.ui.searchAttribute = "data-jsclass"`

  All framework methods uses this attribute to find specific DOM elements.  
  Value of search attributes defines logical name of element specified.
  For example:  
    `<div class="some-class" data-jsclass="element-logical-name">
    </div>`  
  To get such element use:  
    `PHM.app.getSelector("element-logical-name")`  
  or within widget:  
    `@getChildElement("element-logical-name")`  


IMPORTANT NOTE
--------------    
  Although we use jQuery finders and event listeners in framework itself **You should not use jQuery methods in you app logics !!!** Actually we can switch from jQuery to any other library in any time.   

##Widgets
  To define a simple widget class:  
  `class MyWidget extends PHM.ui.Widget  
  PHM.app.registerWidgetClass("my_widget_class_name", MyWidget)`

  Currently we use [haml-js](https://github.com/creationix/haml-js) for client side templates. It converts templates to
  JS functions and wraps them into JST namespace.
  You can use any templating engine thought. Just define PHM.ui.templateStorage
  method to return a template storage object you want.

  In order to add widget to your application you can use either:  
      `PHM.app.addWidget(String widgetClassName, Object Selector)`  
  Ex.  
      `PHM.app.addWidget("my_widget_class_name", PHM.ui.getSelector("my-widget-placeholder"))`

  Or within widget:  
      `@addWidget(String widgetClassName, Object SelectorName)`  
  Ex.  
      `@addWidget("my_widget_class_name", "my-widget-placeholder")`

