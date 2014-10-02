(function () {
    "use strict";

    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    // TODO: Replace the data with your real data.
    // You can add data from asynchronous sources whenever it becomes available.
    fetchNewsFromSharePoint().forEach(function (item) {
        list.push(item);
    });

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

    // Returns an array of news items. 
    function fetchNewsFromSharePoint() {

        var items
        var allFetchedNews = [];
        

        // call component of SharePoint Dal
        var spd = new SharePointDal.ImageLibrary();
        var newsItems = spd.getNews();

        if (newsItems != null) {

            var groups = [];

            for (var index = 0; index < newsItems.length; index++) {
                var news = newsItems[index];
                var newsItemGrp = news.group;

                // find Exisiting Group
                var existingGroup = null;
                for (var i = 0; i < groups.length; i++) {
                    var grp = groups[i];
                    if (grp.key === newsItemGrp) {
                        existingGroup = grp;
                    }
                }

                if (existingGroup == null) {
                    // add new group
                    var existingGroup = {};
                    existingGroup.key = newsItemGrp;
                    existingGroup.title = newsItemGrp;
                    existingGroup.subtitle = "News Type : " + newsItemGrp;
                    existingGroup.backgroundImage = news.image;
                    existingGroup.description = newsItemGrp;
                    groups.push(existingGroup)
                }

                // create new NEWS item
                var newsItem = {}
                newsItem.group = existingGroup;
                newsItem.title = news.title;
                newsItem.subtitle = news.title;
                newsItem.description = news.description;
                newsItem.content = news.details;
                newsItem.backgroundImage = news.image;
                allFetchedNews.push(newsItem);


            }
        }
        return allFetchedNews;
    }
})();
