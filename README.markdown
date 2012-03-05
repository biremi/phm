#PHM javascript framework documentation
[![endorse](http://api.coderwall.com/biremi/endorsecount.png)](http://coderwall.com/biremi)
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

##DOM manipulation and selectors
To separate CSS and app logics DOM manipulation a special element attribute is used.

    PHM.ui.searchAttribute = "data-jsclass"

You can easily set this attribute to any you like. All framework methods uses
this attribute to find specific DOM elements. Value of search attributes
defines **logical name** of element specified.  
For example:

    <div class="some-class" data-jsclass="element-logical-name">
    </div>
To get such element use:

    PHM.app.getSelector("element-logical-name")
or within widget:

    @getChildElement("element-logical-name")

###IMPORTANT NOTE
Although we use jQuery finders and event listeners in framework itself **You should not use jQuery methods in you app logics !!!** Actually we can switch from jQuery to any other library in any time.   

##Widgets
To define a simple widget class:

    class MyWidget extends PHM.ui.Widget
    PHM.app.registerWidgetClass("my_widget_class_name", MyWidget)

Currently we use [haml-js](https://github.com/creationix/haml-js) for client side templates. It converts templates to
JS functions and wraps them into JST namespace.
You can use any templating engine thought. Just define PHM.ui.templateStorage
method to return a template storage object you want.  
Let's define simple template for MyWidget Class using haml syntax:

    .my-widget-class
      %span{data-jsclass: "my-widget-label"}= label
      %span{data-jsclass: "my-widget-text"}


In order to add widget to your application you can use either:

    PHM.app.addWidget(String widgetClassName, String contextId, Object Placeholder, Object params)
Ex.

    PHM.app.addWidget("my_widget_class_name", "1", PHM.ui.getSelector("my-widget-placeholder", {label: "Some label"}))

Or within widget:

    @addWidget(String widgetClassName, Object SelectorName)
Ex.

    @addWidget("my_widget_class_name", "my-widget-placeholder")

If your widget has no contextId and can have only one instance in application
you should use addSingletonWidget method instead of addWidget:

    PHM.app.addSingletonWidget(String widgetClassName, Object Placeholder, Object params)
Ex.

    PHM.app.addSingletonWidget("my_widget_class_name", PHM.ui.getSelector("my-widget-placeholder", {label: "Some label"}))

**Widget methods**

Widget constructor sets up instance attributes:

  `@contextId` - widget context identifier passed to constructor  
  `@params` - passed params

*prepareRenderParams*

- If you need to prepare render parameters for widget template before passing them to your
template engine you should define `prepareRenderParams` method in
widget class:

    
        class MyWidget extends PHM.ui.Widget
          prepareRenderParams: ->
            params =
              label: "#{@params.label}-#{@contextId}"

        PHM.app.registerWidgetClass("my_widget_class_name", MyWidget)


*postInit*

- Defines any widget actions after rendering widget and adding it to
application. For example adding child widgets (subwidgets):


        class MyWidget extends PHM.ui.Widget
          postInit: ->
            @addSingletonWidget("my_child_widget", "child-widget-placeholder")

        PHM.app.registerWidgetClass("my_widget_class_name", MyWidget)

### Common Element methods available for widgets:

*getElement*

- Widget DOM object (jQuery element Object)

*bindClick(Function callback)*

- Defines widget as clickable and sets callback if needed.
This also sets up blur event handling for this widget.

*enable*

- Enables click event handling. Removing class 'disabled'

*disable*

- Disables click event handling. Adding class 'disabled'

*getChildElement(String selector)*

- Getting child DOM element by searchAttribute value

###Other common Element methods

Defined in PHM.ui.Element:  
  `addClass`, `removeClass`, `hasClass`, `addChildElementClass`,
  `removeChildElementClass`, `show`, `hide`, `isHidden`, `isVisible`,
  `startLoading`, `stopLoading`, `getChildElementValue`,
  `setChildElementValue`, ...

You can always check out existing widgets and widget classes in your
application by checking:

    PHM.app.widgetClasses
    PHM.app.widgets

There are also some helper methods in PHM.app:

*getWidget(String className, String contextId)*

- Get widget by className class and contextId

*getSingletonWidget(String className)*

- Get singleton widget by className

Other methods:   
    `hasWidget(className, contextId)`, `removeWidget(className, contextId)`,
    `removeSingletonWidget(className)` 

##Controls

Simplified widgets that has no context identifier and are used only within
widgets. PHM framework comes up with a set of predefined controls:

- Button
- Label
- TextInput
  ...

You can also define your own controls. Here is full definition of Label control:

    ###
     Library::Label class
    ###
    class Label extends PHM.ui.Control
      # common control methods if needed goes here
      parseProperties: (element) ->
        @text = $(element).attr('text')
        @template = $(element).attr('template')

      prepareRenderParams: ->
        {text: @text}

      postInit: ->
        @bindClick()

      setText: (txt) ->
        @getElement().html(txt)

    PHM.ui.registerLibraryElement("label", Label)

Label view template:

    %span= text

### Using library elements

In order to use library elements in your widgets just add special DOM element
to your widget view.
      
    %uilibrary{type: <control-type>, name: <control-name>}

For example:

    %span
      %uilibrary{type: "button", name: "startButton", text: "Click me"}

Framework rendering pipeline searches for those elements and do the folowing:

  - creates a library element (control) with specific type (attribute `type` is
    necessary)
  - renders control view and appends it to your widget view (DOM)
  - sets widget.control-name to control object created (attribute `name` is
    necessary).
    
In our example: widget.startButton will be set to PHM.ui.Library.Button
instance object. Rendered html will be:

    <span id="my_widget-1">
      <div class="button" id="button-1">
        <span class="text" data-jsclass="text">
          Click me
        </span>
      </div>
    </span>

Additional <uilibrary> element attributes can be specified depending on
Control implementation and API.

**Widget describes:**

  - It's context validation methods (if needed)

    `@allowedContext` class method
  - passed params presentation (with prepareRenderParams)
  - manupulating child widgets (adding, removing only)
  - manipulating child DOM elements (showing, hiding, adding, removing classes)

**Widget should not include:**

  - any jQuery finders, eventHandlers
  - controls callbacks (all controls should be defined as library elements)
  - direct manipulating other widgets

##Behaviors

Application logic should be separated from widgets logic:

**Behaviors**

   - describes widgets behaviors (calling widgets API methods) as respond to events 
      + controls events handlers
      + area events handlers

**PHM.events methods**

    onWidget (String widgetClass, String eventName, Function handler)
- widget is passed as `this`

    onControl (String widgetClass, String controlName, String eventName,
    Function handler) ->
- control is passed as `this`

    Example:

        PHM.events.onControl 'my_widget', 'startButton', 'click', ->
          @parentWidget.startLoading()

Here is an example or real application behavior:

      PHM.events.onControl 'slider_input', 'amountInput', 'value_changed', ->
        validateAmount(@parentWidget)

      PHM.events.onControl 'slider_input', 'amountInput', 'blur', ->
        validateAmount(@parentWidget)

      PHM.events.onControl 'slider_input', 'amountSlider', 'value_changed', ->
        @parentWidget.amountInput.setValue(@getValue())
        validateAmount(@parentWidget)

##Comet and area events

 Comet event handler can be defined using:

     PHM.events.onComet (String eventName, Function handler)


 Commonly comet event handler are defined in separate modules which do the
 following:
    
    - process comet event data (stores it on client side)
    - fires area event (PHM.events.fireAreaEvent(String eventName, Object data))

  Example:

    PHM.comet.on "user-is-online", (data) ->
      PHM.app.models.User.setUser(data)
      PHM.events.fireAreaEvent("user-is-online", data)

