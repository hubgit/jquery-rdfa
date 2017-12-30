# jQuery RDFa

Extract and manipulate objects stored in [HTML + RDFa Lite](https://www.w3.org/TR/rdfa-lite/).

[Demonstration](http://git.macropus.org/jquery-rdfa/demo/)

### Get all items of a certain type

$(node).items(itemtype)

    $('#albumlist').items('MusicAlbum')

### Get the property nodes of an item

item.property(property) => a set of jQuery nodes

    $(node).property('name') => [ node ]

    $(node).property('byArtist').eq(0).property('album') => [ node, node ]

### Get the value of a property

property.value() => the itemValue of the node(s)

    $(node).property('name').value() => string

    $(node).property('byArtist').eq(0).property('name').value() => string

### Get the values of a property as an array

property.values() => array of the itemValues of the nodes

    $(node).property('name').values() => [ string, string ]

### Set a property

item.property(property).value(value)

    $(node).property('name').value('Yellow Submarine')

### Set one of multiple properties with the same name

item.property(property).eq(index).value(value)

    $(node).property('name').eq(1).value('Yellow Submarine')
    
## jQuery Things

The plugin also provides a convenience method for working with items ("things") where there is only a single instance of each property. This is analogous to [jQuery's `data` method](http://api.jquery.com/data/).

### Get a property of an item

item.metadata(key)

    $(node).metadata('name');

### Set a property of an item

item.metadata(key, value)

    $(node).metadata('name', 'The Beatles');

### Set multiple properties of an item

item.metadata({ key: value })

    $(node).metadata({
        name: 'The Beatles',
        url: 'https://en.wikipedia.org/wiki/The_Beatles'
    });

### Get all properties of a single item or a collection of matched items

collection.metadata()

    $(node).metadata()
    
    $('#albumlist').items('MusicAlbum').metadata()

