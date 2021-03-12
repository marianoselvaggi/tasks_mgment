class FriendList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        global.console.log(`New friendship with "${name}"`);
    }

    removeFriend(name) {
        const exist = this.friends.indexOf(name);
        if(exist === -1) {
            throw new Error('The friend dos not exist');
        }
        this.friends.splice(exist,1);
    }
}

describe('FriendList', () => {
    let friendList: FriendList;
    beforeEach(() => {
        friendList = new FriendList();
    });

    it('initialization', () => {        
        expect(friendList.friends.length).toEqual(0);
    });

    it('Add a friend', () => {
        friendList.addFriend('Mariano');
        expect(friendList.friends.length).toEqual(1);
    });

    it('Announce a Friend', () => {
        friendList.announceFriendship = jest.fn();
        expect(friendList.announceFriendship).not.toHaveBeenCalled();
        friendList.addFriend('Mariano');
        expect(friendList.announceFriendship).toHaveBeenCalled();
    });

    describe('Remove a friend', () => {
        it('remove an existing friend from list', () => {
            friendList.addFriend('Mariano');
            friendList.removeFriend('Mariano');
            expect(friendList.friends[0]).toBeUndefined();
        });

        it('remove an unexisted friend from list should throw error', () => {
            expect(() => friendList.removeFriend('Mariano')).toThrow(Error);
        });
    });
});