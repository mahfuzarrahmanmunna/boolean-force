// components/TeamLeaderManager.js
"use client";

import { useState, useEffect } from "react";
import { FaUsers, FaUserShield, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { showNotification } from "@/lib/notification";

export default function TeamLeaderManager({ users, setUsers }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        if (users) {
            setFilteredUsers(
                users.filter(user => 
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [users, searchTerm]);

    const handleToggleTeamLeader = async (userId, currentStatus) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isTeamLeader: !currentStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update team leader status");
            }

            const result = await response.json();
            
            // Update the users list with the updated user
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user._id === userId 
                        ? { ...user, isTeamLeader: !currentStatus } 
                        : user
                )
            );

            showNotification(
                result.message || "Team leader status updated successfully",
                "success"
            );
        } catch (error) {
            console.error("Error updating team leader status:", error);
            showNotification(error.message || "Failed to update team leader status", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FaUserShield className="text-primary" />
                    Team Leader Management
                </CardTitle>
                <CardDescription>
                    Select team leaders who can submit tasks on behalf of their teams
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="relative">
                        <Input
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                    {user.role}
                                                </Badge>
                                                {user.jobTitle && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {user.jobTitle}
                                                    </Badge>
                                                )}
                                                {user.isTeamLeader && (
                                                    <Badge variant="default" className="bg-green-500">
                                                        Team Leader
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleToggleTeamLeader(user._id, user.isTeamLeader)}
                                        disabled={isLoading || user.role === 'admin'}
                                        className="flex items-center gap-2"
                                    >
                                        {user.isTeamLeader ? (
                                            <>
                                                <FaToggleOn className="h-5 w-5 text-green-500" />
                                                <span className="text-green-500">Team Leader</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaToggleOff className="h-5 w-5 text-muted-foreground" />
                                                <span>Make Leader</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-4">
                                {searchTerm ? "No users match your search." : "No users available."}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}