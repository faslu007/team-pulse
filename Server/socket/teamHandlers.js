import { Game } from '../models/Game.js';
import { Team } from '../models/Team.js';

export default function teamHandlers(io, socket) {
    socket.on('updateTeamName', async ({ roomId, teamId, newName }) => {
        try {
            const game = await Game.findOne({ roomId });
            if (!game) {
                socket.emit('updateTeamNameError', 'Game not found');
                return;
            }

            const team = await Team.findById(teamId);
            if (!team) {
                socket.emit('updateTeamNameError', 'Team not found');
                return;
            }

            team.teamName = newName;
            await team.save();

            socket.emit('updateTeamNameSuccess', { teamId, newName });
            socket.to(roomId).emit('teamNameUpdated', { teamId, newName });
        } catch (error) {
            console.error('Error updating team name:', error);
            socket.emit('updateTeamNameError', 'Server error occurred');
        }
    });

    socket.on('deleteTeam', async ({ roomId, teamId }) => {
        try {
            const game = await Game.findOne({ roomId });
            if (!game) {
                socket.emit('deleteTeamError', 'Game not found');
                return;
            }

            // Remove team association from all participants
            game.participants = game.participants.map(participant => {
                if (participant.team && participant.team.toString() === teamId) {
                    return { ...participant, team: null };
                }
                return participant;
            });

            // Remove the team from the game's teams array
            game.teams.pull(teamId);

            // Save the updated game
            await game.save();

            // Delete the team document
            await Team.findByIdAndDelete(teamId);

            socket.emit('deleteTeamSuccess', { teamId });
            socket.to(roomId).emit('teamDeleted', { teamId });

            // Emit an event to update participants
            io.to(roomId).emit('participantsUpdated', game.participants);
        } catch (error) {
            console.error('Error deleting team:', error);
            socket.emit('deleteTeamError', 'Server error occurred');
        }
    });
}