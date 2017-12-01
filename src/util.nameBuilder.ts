var utilNameBuilder = {
    getName: function(role: string) {
        if (Memory.nameIndex === undefined)
            Memory.nameIndex = {};

        if ((Memory.nameIndex[role] === undefined) || (Memory.nameIndex[role] > 996))
            Memory.nameIndex[role] = 0;
        Memory.nameIndex[role] += 1;
        return role + (Memory.nameIndex[role] + 1);
    },

    commitName: function(role: string) {
        var newIndex = Memory.nameIndex[role] + 1;
        Memory.nameIndex[role] = newIndex;
    }
};

module.exports = utilNameBuilder;
