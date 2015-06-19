/**
 * Created by mtime on 15/6/18.
 */



var cacheInstance;

var Cache = function () {
    var _cache = [];
    this.getCache = function () {
        return _cache;
    }
    this.addCache = function (item) {
        _cache.push(item);
    }
}

Cache.prototype = {
    getUsersExcept: function (name) {
        return this.getCache().filter(function (item) {
            return item.name != name;
        }).map(function (user) {
            return user.name;
        });

    },

    addUser: function (name, socket) {
        if (!this.exist()) {
            this.addCache({
                name: name,
                socket: socket
            });
        }
    },
    exist: function (name) {
        return this.getCache().filter(function (item) {
            return item.name == name;
        }).length > 0 ? 1 : 0;
    },
    rmUser: function (name) {
    },
    getSocket: function (name) {
        if (name == '') {
            return this.getAllSock();
        } else {
            return this.getCache().filter(function (item) {
                return item.name == name;
            });
        }
    },
    deleteSocket: function (id) {
        this.getCache().map(function (item,index) {
           return item.name==id && index ;
        })

        (typeof sock[0] =='number' )&& this.getCache().splice(sock[0],1);
    },
    getAllSock: function () {
        return this.getCache().map(function (item) {
            return item.socket;
        })
    },
    getSocketsExcept: function (id) {
        return this.getCache()
            .filter(function (item) {
                return item.name != id;
            })
            .map(function (item) {
                return item.socket;
            })
    }

}

!cacheInstance && (cacheInstance = new Cache());


exports.cache = cacheInstance;

